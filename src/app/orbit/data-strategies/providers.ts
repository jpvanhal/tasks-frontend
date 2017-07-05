import { Provider } from '@angular/core';
import { Strategy } from '@orbit/coordinator';

import { createEventLoggingStrategy } from './event-logging';
import { createLogTruncationStrategy } from './log-truncation';
import { createRemotePushFailStrategy } from './remote-push-fail';
import { createRemoteStoreSyncOptimisticStrategy } from './remote-store-sync-optimistic';
import { createStoreBackupSyncPessimisticStrategy } from './store-backup-sync-pessimistic';
import { createStoreRemoteQueryOptimisticStrategy } from './store-remote-query-optimistic';
import { createStoreRemoteUpdateOptimisticStrategy } from './store-remote-update-optimistic';

export const DATA_STRATEGY_PROVIDERS: Provider[] = [
  { provide: Strategy, multi: true, useFactory: createEventLoggingStrategy },
  { provide: Strategy, multi: true, useFactory: createLogTruncationStrategy },
  { provide: Strategy, multi: true, useFactory: createStoreBackupSyncPessimisticStrategy },
  { provide: Strategy, multi: true, useFactory: createRemoteStoreSyncOptimisticStrategy },
  { provide: Strategy, multi: true, useFactory: createStoreRemoteQueryOptimisticStrategy },
  { provide: Strategy, multi: true, useFactory: createStoreRemoteUpdateOptimisticStrategy },
  { provide: Strategy, multi: true, useFactory: createRemotePushFailStrategy },
];
