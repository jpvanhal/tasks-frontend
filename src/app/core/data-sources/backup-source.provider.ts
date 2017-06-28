import { InjectionToken, Provider } from '@angular/core';
import IndexedDBSource from '@orbit/indexeddb';

import { BackupSource } from './backup-source.interface';
import { SchemaService } from '../schema.service';

export function createBackupSource(schema: SchemaService): BackupSource {
  return new IndexedDBSource({
    name: 'backup',
    namespace: 'tasks',
    schema,
  });
}

export const BACKUP_SOURCE = new InjectionToken<BackupSource>('backup source');

export const backupSourceProvider: Provider = {
  provide: BACKUP_SOURCE,
  useFactory: createBackupSource,
  deps: [ SchemaService ],
};
