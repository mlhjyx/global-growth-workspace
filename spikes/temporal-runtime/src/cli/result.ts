/** 等待并打印 workflow 最终结果：tsx src/cli/result.ts <workflowId> */
import { getClient } from './client';

async function main(): Promise<void> {
  const [workflowId] = process.argv.slice(2);
  const client = await getClient();
  const result = await client.workflow.getHandle(workflowId).result();
  console.log(JSON.stringify({ workflowId, result }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
