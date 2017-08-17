import { InjectionToken, Provider } from '@angular/core';
import { KeyMap, Schema, Source } from '@orbit/data';

import { BackupSource, createBackupSource } from './backup';
import { RemoteSource, createRemoteSource } from './remote';

export const BACKUP_SOURCE = new InjectionToken<BackupSource>('backup source');
export const REMOTE_SOURCE = new InjectionToken<RemoteSource>('remote source');

export const DATA_SOURCE_PROVIDERS: Provider[] = [
  { provide: BACKUP_SOURCE, useFactory: createBackupSource, deps: [ Schema ] },
  { provide: REMOTE_SOURCE, useFactory: createRemoteSource, deps: [ KeyMap, Schema ] },
  { provide: Source, useExisting: BACKUP_SOURCE, multi: true },
  { provide: Source, useExisting: REMOTE_SOURCE, multi: true },
];
