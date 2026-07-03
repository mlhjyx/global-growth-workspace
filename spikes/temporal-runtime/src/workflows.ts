/**
 * SPK-TMP 首个 Workflow 骨架：CampaignDryRunApproval
 *
 * 链路（全部 activity 为 mock，对应 M1 计划 SPK-TMP 行）：
 *   Campaign Draft → DryRun → ActionProposal → PolicyCheck
 *   → 等待人工审批 Signal 'approvalDecision'（带超时 Timer，超时 = RETURNED）
 *   → 签发 ExecutionAuthorization → Mock 执行 → Result
 *
 * 验证点映射：
 * - Signal 等待 + 超时：wf.condition(..., timeoutMs)
 * - Retry：proxyActivities 的 retry policy + policyCheck 可注入瞬时故障
 * - 补偿（Saga）：mockExecute 永久失败 → revokeAuthorization → COMPENSATED
 * - 版本化：wf.patched('spk-tmp-authz-v2') 基线标记
 * - Activity 幂等：所有 activity 携带确定性 idempotencyKey（workflowId 派生）
 * - Worker 重启恢复：状态全在 Temporal event history，Worker 无本地状态
 */
import * as wf from '@temporalio/workflow';
import type * as activities from './activities';

export interface ApprovalDecision {
  approved: boolean;
  approver: string;
  comment?: string;
}

export interface CampaignDryRunApprovalInput {
  campaignId: string;
  workspaceId: string;
  /** 人工审批超时（毫秒），超时 = RETURNED。默认 120s */
  approvalTimeoutMs?: number;
  /** 注入 policyCheck 瞬时故障（验证 Temporal Retry + Activity 幂等） */
  simulateFlakyPolicy?: boolean;
  /** 注入 mockExecute 永久失败（验证 Saga 补偿） */
  simulateExecFailure?: boolean;
}

export type FinalStatus =
  | 'AUTHORIZED' // 审批通过 + 授权签发 + mock 执行成功
  | 'RETURNED' // 审批超时退回
  | 'REJECTED' // 人工拒绝
  | 'DENIED' // Policy 拒绝
  | 'COMPENSATED'; // 执行永久失败，授权已补偿撤销

export interface CampaignDryRunApprovalResult {
  status: FinalStatus;
  campaignId: string;
  workspaceId: string;
  dryRunId?: string;
  proposalId?: string;
  authorizationId?: string;
  authzVersion?: string;
  policyAttempts?: number;
  policyIdempotentHit?: boolean;
  execution?: activities.MockExecuteResult;
  reason?: string;
}

export const approvalDecisionSignal = wf.defineSignal<[ApprovalDecision]>('approvalDecision');
export const statusQuery = wf.defineQuery<string>('status');

const acts = wf.proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
  retry: {
    initialInterval: '1 second',
    backoffCoefficient: 2,
    maximumInterval: '10 seconds',
    maximumAttempts: 5,
  },
});

export async function CampaignDryRunApproval(
  input: CampaignDryRunApprovalInput,
): Promise<CampaignDryRunApprovalResult> {
  const wfId = wf.workflowInfo().workflowId;
  let status = 'DRY_RUN';
  let decision: ApprovalDecision | undefined;

  wf.setHandler(statusQuery, () => status);
  wf.setHandler(approvalDecisionSignal, (d) => {
    decision = d;
  });

  const base = { campaignId: input.campaignId, workspaceId: input.workspaceId };

  // 1. Dry Run（mock）
  const dryRun = await acts.dryRunCampaign({
    ...base,
    idempotencyKey: `${wfId}:dryRun`,
  });

  // 2. 生成 ActionProposal（mock）—— AI 不拥有状态，提案是确定性系统的输入
  status = 'GENERATING_PROPOSAL';
  const proposal = await acts.generateActionProposal({
    ...base,
    dryRunId: dryRun.dryRunId,
    idempotencyKey: `${wfId}:proposal`,
  });

  // 3. Policy Check（mock，可注入瞬时故障验证 Retry/幂等）
  status = 'POLICY_CHECK';
  const policy = await acts.policyCheck({
    proposalId: proposal.proposalId,
    simulateFlaky: input.simulateFlakyPolicy ?? false,
    idempotencyKey: `${wfId}:policy`,
  });
  if (policy.decision === 'DENY') {
    status = 'DENIED';
    return { status: 'DENIED', ...base, dryRunId: dryRun.dryRunId, proposalId: proposal.proposalId, reason: 'policy denied' };
  }

  // 4. 等待人工审批 Signal（带超时 Timer；超时 = RETURNED 退回）
  status = 'AWAITING_APPROVAL';
  const signaled = await wf.condition(() => decision !== undefined, input.approvalTimeoutMs ?? 120_000);
  if (!signaled) {
    status = 'RETURNED';
    return {
      status: 'RETURNED',
      ...base,
      dryRunId: dryRun.dryRunId,
      proposalId: proposal.proposalId,
      reason: `approval timeout after ${input.approvalTimeoutMs ?? 120_000}ms`,
    };
  }
  if (!decision!.approved) {
    status = 'REJECTED';
    return {
      status: 'REJECTED',
      ...base,
      dryRunId: dryRun.dryRunId,
      proposalId: proposal.proposalId,
      reason: `rejected by ${decision!.approver}: ${decision!.comment ?? ''}`,
    };
  }

  // 版本化基线：patched() 标记。新代码走 v2，历史 replay 走 v1（本 spike 双路径行为一致，仅验证标记机制）。
  const authzVersion = wf.patched('spk-tmp-authz-v2') ? 'v2' : 'v1';

  // 5. 签发 ExecutionAuthorization（mock）
  status = 'ISSUING_AUTHORIZATION';
  const authz = await acts.issueExecutionAuthorization({
    proposalId: proposal.proposalId,
    approver: decision!.approver,
    idempotencyKey: `${wfId}:authz`,
  });

  // 6. Mock 执行；永久失败 → Saga 补偿撤销授权
  status = 'EXECUTING';
  try {
    const execution = await acts.mockExecute({
      authorizationId: authz.authorizationId,
      simulateFailure: input.simulateExecFailure ?? false,
      idempotencyKey: `${wfId}:exec`,
    });
    status = 'COMPLETED';
    return {
      status: 'AUTHORIZED',
      ...base,
      dryRunId: dryRun.dryRunId,
      proposalId: proposal.proposalId,
      authorizationId: authz.authorizationId,
      authzVersion,
      policyAttempts: policy.attempts,
      policyIdempotentHit: policy.idempotentHit,
      execution,
    };
  } catch (err) {
    status = 'COMPENSATING';
    await acts.revokeAuthorization({
      authorizationId: authz.authorizationId,
      reason: 'execution permanently failed — saga compensation',
      idempotencyKey: `${wfId}:revoke`,
    });
    status = 'COMPENSATED';
    return {
      status: 'COMPENSATED',
      ...base,
      dryRunId: dryRun.dryRunId,
      proposalId: proposal.proposalId,
      authorizationId: authz.authorizationId,
      authzVersion,
      reason: `execution failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
