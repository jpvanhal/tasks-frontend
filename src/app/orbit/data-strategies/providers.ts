import { Provider } from '@angular/core';

import { STRATEGY } from '../tokens';
import { createEventLoggingStrategy } from './event-logging';
import { createLogTruncationStrategy } from './log-truncation';
import { createRemotePullFailStrategy } from './remote-pull-fail';
import { createRemotePullStoreEvictionStrategy } from './remote-pull-store-eviction';
import { createRemotePushFailStrategy } from './remote-push-fail';
import { createRemoteStoreSyncOptimisticStrategy } from './remote-store-sync-optimistic';
import { createStoreBackupSyncPessimisticStrategy } from './store-backup-sync-pessimistic';
import { createStoreRemoteQueryOptimisticStrategy } from './store-remote-query-optimistic';
import { createStoreRemoteUpdateOptimisticStrategy } from './store-remote-update-optimistic';

export const DATA_STRATEGY_PROVIDERS: Provider[] = [
  { provide: STRATEGY, multi: true, useFactory: createEventLoggingStrategy },
  { provide: STRATEGY, multi: true, useFactory: createLogTruncationStrategy },
  { provide: STRATEGY, multi: true, useFactory: createRemotePullFailStrategy },
  { provide: STRATEGY, multi: true, useFactory: createRemotePullStoreEvictionStrategy },
  { provide: STRATEGY, multi: true, useFactory: createRemotePushFailStrategy },
  { provide: STRATEGY, multi: true, useFactory: createRemoteStoreSyncOptimisticStrategy },
  { provide: STRATEGY, multi: true, useFactory: createStoreBackupSyncPessimisticStrategy },
  { provide: STRATEGY, multi: true, useFactory: createStoreRemoteQueryOptimisticStrategy },
  { provide: STRATEGY, multi: true, useFactory: createStoreRemoteUpdateOptimisticStrategy },
];
