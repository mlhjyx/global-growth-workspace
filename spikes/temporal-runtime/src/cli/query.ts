/** 查询 workflow 内部状态：tsx src/cli/query.ts <workflowId> */
import { getClient } from './client';

async function main(): Promise<void> {
  const [workflowId] = process.argv.slice(2);
  const client = await getClient();
  const status = await client.workflow.getHandle(workflowId).query('status');
  console.log(JSON.stringify({ workflowId, status }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
