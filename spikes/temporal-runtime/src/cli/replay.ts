/**
 * 确定性/版本化基线验证：从 Server 拉取真实执行历史，用当前 workflow 代码 replay。
 * replay 通过 = 当前代码与历史兼容（patched() 标记机制的前提）。
 * 用法：tsx src/cli/replay.ts <workflowId>
 */
import { Worker } from '@temporalio/worker';
import { getClient } from './client';

async function main(): Promise<void> {
  const [workflowId] = process.argv.slice(2);
  const client = await getClient();
  const history = await client.workflow.getHandle(workflowId).fetchHistory();
  await Worker.runReplayHistory(
    { workflowsPath: require.resolve('../workflows') },
    history,
  );
  console.log(JSON.stringify({ workflowId, replay: 'OK — history is deterministic against current workflow code' }));
}

main().catch((err) => {
  console.error('replay FAILED', err);
  process.exit(1);
});
