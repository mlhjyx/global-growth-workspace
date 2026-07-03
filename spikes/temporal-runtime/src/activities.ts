/**
 * SPK-TMP mock activities。
 *
 * Activity 幂等模式：每个 activity 接收确定性 idempotencyKey（workflowId 派生），
 * 副作用先落幂等存储（本 spike 用本地 JSON 文件模拟「业务 PG 表 + 唯一键」），
 * Temporal 重试 / Worker 重启后重放时命中存储 → 返回同一结果，不重复产生副作用。
 * 生产实现应替换为 PG 表 + workspace_id + 唯一约束（BE-05 Outbox 同款思路）。
 */
import { Context, ApplicationFailure } from '@temporalio/activity';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const STATE_FILE = path.resolve(__dirname, '..', 'state', 'idempotency-store.json');

function loadStore(): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveStore(store: Record<string, unknown>): void {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(store, null, 2));
}

function idempotent<T extends object>(key: string, produce: () => T): T & { idempotentHit: boolean } {
  const store = loadStore();
  if (store[key] !== undefined) {
    return { ...(store[key] as T), idempotentHit: true };
  }
  const result = produce();
  store[key] = result;
  saveStore(store);
  return { ...result, idempotentHit: false };
}

function log(activity: string, msg: string): void {
  const info = Context.current().info;
  console.log(
    `[activity:${activity}] pid=${process.pid} wf=${info.workflowExecution?.workflowId} attempt=${info.attempt} ${msg}`,
  );
}

// ---------- 1. Dry Run ----------

export interface DryRunInput {
  campaignId: string;
  workspaceId: string;
  idempotencyKey: string;
}
export interface DryRunResult {
  dryRunId: string;
  audienceSize: number;
  estimatedActions: number;
  idempotentHit?: boolean;
}

export async function dryRunCampaign(input: DryRunInput): Promise<DryRunResult> {
  log('dryRunCampaign', `campaign=${input.campaignId}`);
  return idempotent(input.idempotencyKey, () => ({
    dryRunId: `dryrun-${randomUUID()}`,
    audienceSize: 128,
    estimatedActions: 42,
  }));
}

// ---------- 2. ActionProposal ----------

export interface ProposalInput {
  campaignId: string;
  workspaceId: string;
  dryRunId: string;
  idempotencyKey: string;
}
export interface ProposalResult {
  proposalId: string;
  actionType: string;
  channel: string;
  requiresApproval: boolean;
  idempotentHit?: boolean;
}

export async function generateActionProposal(input: ProposalInput): Promise<ProposalResult> {
  log('generateActionProposal', `dryRun=${input.dryRunId}`);
  return idempotent(input.idempotencyKey, () => ({
    proposalId: `prop-${randomUUID()}`,
    actionType: 'outreach.email.send',
    channel: 'email',
    requiresApproval: true,
  }));
}

// ---------- 3. Policy Check（可注入瞬时故障，验证 Retry + 幂等） ----------

export interface PolicyCheckInput {
  proposalId: string;
  simulateFlaky: boolean;
  idempotencyKey: string;
}
export interface PolicyCheckResult {
  decision: 'ALLOW' | 'REQUIRE_APPROVAL' | 'DENY';
  attempts: number;
  idempotentHit: boolean;
}

export async function policyCheck(input: PolicyCheckInput): Promise<PolicyCheckResult> {
  const attempt = Context.current().info.attempt;
  const store = loadStore();

  if (store[input.idempotencyKey] !== undefined) {
    // 重试/重放命中幂等存储：副作用只发生过一次
    log('policyCheck', `idempotent HIT, decision reused`);
    const cached = store[input.idempotencyKey] as { decision: PolicyCheckResult['decision'] };
    return { decision: cached.decision, attempts: attempt, idempotentHit: true };
  }

  // 副作用（决策落库）先写入，再模拟「写入后瞬时故障」——重试时应命中上面的幂等分支
  const decision: PolicyCheckResult['decision'] = 'REQUIRE_APPROVAL';
  store[input.idempotencyKey] = { decision };
  saveStore(store);
  log('policyCheck', `decision=${decision} persisted`);

  if (input.simulateFlaky && attempt < 3) {
    log('policyCheck', `simulating transient outage AFTER side-effect persisted`);
    throw new Error(`simulated transient policy engine outage (attempt ${attempt})`);
  }
  return { decision, attempts: attempt, idempotentHit: false };
}

// ---------- 4. ExecutionAuthorization ----------

export interface IssueAuthzInput {
  proposalId: string;
  approver: string;
  idempotencyKey: string;
}
export interface IssueAuthzResult {
  authorizationId: string;
  proposalId: string;
  approver: string;
  scope: string;
  idempotentHit?: boolean;
}

export async function issueExecutionAuthorization(input: IssueAuthzInput): Promise<IssueAuthzResult> {
  log('issueExecutionAuthorization', `proposal=${input.proposalId} approver=${input.approver}`);
  return idempotent(input.idempotencyKey, () => ({
    authorizationId: `authz-${randomUUID()}`,
    proposalId: input.proposalId,
    approver: input.approver,
    scope: 'mock-execution-only',
  }));
}

// ---------- 5. Mock 执行 ----------

export interface MockExecuteInput {
  authorizationId: string;
  simulateFailure: boolean;
  idempotencyKey: string;
}
export interface MockExecuteResult {
  executionId: string;
  provider: string;
  sentCount: number;
  idempotentHit?: boolean;
}

export async function mockExecute(input: MockExecuteInput): Promise<MockExecuteResult> {
  log('mockExecute', `authz=${input.authorizationId} simulateFailure=${input.simulateFailure}`);
  if (input.simulateFailure) {
    throw ApplicationFailure.nonRetryable('simulated permanent provider rejection', 'MockProviderRejection');
  }
  return idempotent(input.idempotencyKey, () => ({
    executionId: `exec-${randomUUID()}`,
    provider: 'mock-email-provider',
    sentCount: 42,
  }));
}

// ---------- 6. 补偿：撤销授权 ----------

export interface RevokeAuthzInput {
  authorizationId: string;
  reason: string;
  idempotencyKey: string;
}
export interface RevokeAuthzResult {
  authorizationId: string;
  revoked: boolean;
  reason: string;
  idempotentHit?: boolean;
}

export async function revokeAuthorization(input: RevokeAuthzInput): Promise<RevokeAuthzResult> {
  log('revokeAuthorization', `authz=${input.authorizationId} reason=${input.reason}`);
  return idempotent(input.idempotencyKey, () => ({
    authorizationId: input.authorizationId,
    revoked: true,
    reason: input.reason,
  }));
}
