import { Client, Connection } from '@temporalio/client';

export const TASK_QUEUE = 'spk-tmp-campaign';

export async function getClient(): Promise<Client> {
  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS ?? 'localhost:7233',
  });
  return new Client({ connection, namespace: 'default' });
}
