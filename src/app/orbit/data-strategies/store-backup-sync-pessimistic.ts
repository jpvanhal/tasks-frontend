import { SyncStrategy } from '@orbit/coordinator';

export function createStoreBackupSyncPessimisticStrategy() {
  return new SyncStrategy({
    name: 'store-backup-sync-pessimistic',
    source: 'store',
    target: 'backup',
    blocking: true,
  });
}
