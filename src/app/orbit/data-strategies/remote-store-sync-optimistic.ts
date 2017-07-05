import { SyncStrategy } from '@orbit/coordinator';

export function createRemoteStoreSyncOptimisticStrategy() {
  return new SyncStrategy({
    name: 'remote-store-sync-optimistic',
    source: 'remote',
    target: 'store',
    blocking: false,
  });
}
