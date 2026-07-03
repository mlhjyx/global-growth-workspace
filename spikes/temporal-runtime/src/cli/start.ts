/** 启动 CampaignDryRunApproval：tsx src/cli/start.ts <workflowId> [approvalTimeoutMs] [--flaky] [--exec-fail] */
import { getClient, TASK_QUEUE } from './client';

async function main(): Promise<void> {
  const [workflowId, timeoutArg, ...flags] = process.argv.slice(2);
  if (!workflowId) {
    console.error('usage: tsx src/cli/start.ts <workflowId> [approvalTimeoutMs] [--flaky] [--exec-fail]');
    process.exit(1);
  }
  const client = await getClient();
  const handle = await client.workflow.start('CampaignDryRunApproval', {
    taskQueue: TASK_QUEUE,
    workflowId,
    args: [
      {
        campaignId: 'cam-demo-001',
        workspaceId: 'ws-demo-001',
        approvalTimeoutMs: timeoutArg && !timeoutArg.startsWith('--') ? Number(timeoutArg) : undefined,
        simulateFlakyPolicy: flags.includes('--flaky') || timeoutArg === '--flaky',
        simulateExecFailure: flags.includes('--exec-fail') || timeoutArg === '--exec-fail',
      },
    ],
  });
  console.log(JSON.stringify({ started: true, workflowId: handle.workflowId, runId: handle.firstExecutionRunId }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
