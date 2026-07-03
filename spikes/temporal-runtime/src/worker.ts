/** SPK-TMP Worker：注册 CampaignDryRunApproval workflow + mock activities。 */
import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';

export const TASK_QUEUE = 'spk-tmp-campaign';

async function run(): Promise<void> {
  console.log(`[worker] pid=${process.pid} connecting...`);
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS ?? 'localhost:7233',
  });
  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: TASK_QUEUE,
    workflowsPath: require.resolve('./workflows'),
    activities,
  });
  console.log(`[worker] pid=${process.pid} taskQueue=${TASK_QUEUE} RUNNING`);
  await worker.run();
}

run().catch((err) => {
  console.error('[worker] fatal', err);
  process.exit(1);
});
