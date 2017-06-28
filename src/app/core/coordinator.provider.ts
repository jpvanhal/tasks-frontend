import { APP_INITIALIZER, Provider } from '@angular/core';
import { EventLoggingStrategy, LogTruncationStrategy, SyncStrategy } from '@orbit/coordinator';
import { Schema, Source } from '@orbit/data';

import { environment } from '../../environments/environment';
import { CoordinatorService } from './coordinator.service';
import { BackupSource, BACKUP_SOURCE } from './data-sources';
import { StoreService } from './store.service';

export function createCoordinator(store: StoreService, backup: BackupSource): CoordinatorService {
  const coordinator = new CoordinatorService();

  coordinator.addSource(store);
  coordinator.addSource(backup);

  if (!environment.production) {
    coordinator.addStrategy(new EventLoggingStrategy());
  }
  coordinator.addStrategy(new LogTruncationStrategy());
  coordinator.addStrategy(new SyncStrategy({
    name: 'store-backup-sync-pessimistic',
    source: store.name,
    target: backup.name,
    blocking: true
  }));

  return coordinator;
}

export function initializeCoordinator(backup: BackupSource, coordinator: CoordinatorService, store: StoreService) {
  return (): Promise<void> => {
    return backup.pull(q => q.findRecords())
      .then(transform => store.sync(transform))
      .then(() => backup.transformLog.clear())
      .then(() => store.transformLog.clear())
      .then(() => coordinator.activate());
  }
}

export const coordinatorProviders: Provider[] = [
  {
    provide: CoordinatorService,
    useFactory: createCoordinator,
    deps: [
      StoreService,
      BACKUP_SOURCE,
    ],
  },
  {
    provide: APP_INITIALIZER,
    useFactory: initializeCoordinator,
    deps: [
      BACKUP_SOURCE,
      CoordinatorService,
      StoreService,
    ],
    multi: true
  },
];


