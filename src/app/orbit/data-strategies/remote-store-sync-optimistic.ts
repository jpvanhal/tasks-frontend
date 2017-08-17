import { SyncStrategy } from '@orbit/coordinator';

export function createRemoteStoreSyncOptimisticStrategy(): SyncStrategy {
  return new SyncStrategy({
    name: 'remote-store-sync-optimistic',
    source: 'remote',
    target: 'store',
    blocking: false,
  });
}
