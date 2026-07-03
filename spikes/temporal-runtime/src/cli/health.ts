/** 轮询等待 Temporal Server 就绪（default namespace 可描述）。 */
import { Connection } from '@temporalio/client';

async function main(): Promise<void> {
  const address = process.env.TEMPORAL_ADDRESS ?? 'localhost:7233';
  const deadline = Date.now() + 180_000;
  let lastErr: unknown;
  while (Date.now() < deadline) {
    try {
      const conn = await Connection.connect({ address, connectTimeout: '5 seconds' });
      const resp = await conn.workflowService.describeNamespace({ namespace: 'default' });
      console.log(
        `temporal READY at ${address} namespace=${resp.namespaceInfo?.name} state=${resp.namespaceInfo?.state}`,
      );
      await conn.close();
      return;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  console.error('temporal NOT ready after 180s. last error:', lastErr);
  process.exit(1);
}

main();
