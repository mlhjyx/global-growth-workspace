/** 发送人工审批 Signal：tsx src/cli/signal.ts <workflowId> approve|reject [approver] [comment] */
import { getClient } from './client';

async function main(): Promise<void> {
  const [workflowId, verdict, approver, comment] = process.argv.slice(2);
  if (!workflowId || !['approve', 'reject'].includes(verdict)) {
    console.error('usage: tsx src/cli/signal.ts <workflowId> approve|reject [approver] [comment]');
    process.exit(1);
  }
  const client = await getClient();
  const handle = client.workflow.getHandle(workflowId);
  await handle.signal('approvalDecision', {
    approved: verdict === 'approve',
    approver: approver ?? 'owner@local',
    comment: comment ?? `${verdict} via SPK-TMP cli`,
  });
  console.log(JSON.stringify({ signaled: true, workflowId, verdict }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
