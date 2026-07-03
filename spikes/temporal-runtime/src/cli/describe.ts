/** 服务端视角的 workflow 执行状态：tsx src/cli/describe.ts <workflowId> */
import { getClient } from './client';

async function main(): Promise<void> {
  const [workflowId] = process.argv.slice(2);
  const client = await getClient();
  const desc = await client.workflow.getHandle(workflowId).describe();
  console.log(
    JSON.stringify({ workflowId, serverStatus: desc.status.name, startTime: desc.startTime, historyLength: desc.historyLength }),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
