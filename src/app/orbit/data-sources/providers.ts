import { InjectionToken, Provider } from '@angular/core';

import { BUCKET, SCHEMA, SOURCE } from '../tokens';
import { BackupSource, createBackupSource } from './backup';
import { RemoteSource, createRemoteSource } from './remote';

export const BACKUP_SOURCE = new InjectionToken<BackupSource>('BackupSource');
export const REMOTE_SOURCE = new InjectionToken<RemoteSource>('RemoteSource');

export const DATA_SOURCE_PROVIDERS: Provider[] = [
  { provide: BACKUP_SOURCE, useFactory: createBackupSource, deps: [ BUCKET, SCHEMA ] },
  { provide: REMOTE_SOURCE, useFactory: createRemoteSource, deps: [ BUCKET, SCHEMA ] },
  { provide: SOURCE, useExisting: BACKUP_SOURCE, multi: true },
  { provide: SOURCE, useExisting: REMOTE_SOURCE, multi: true },
];
