import { Pullable, Pushable, Resettable, Schema, Source, Syncable } from '@orbit/data';
import IndexedDBSource from '@orbit/indexeddb';

export type BackupSource = Source & Pullable & Pushable & Resettable & Syncable;

export function createBackupSource(schema: Schema): BackupSource {
  return new IndexedDBSource({
    name: 'backup',
    namespace: 'tasks',
    schema,
  });
}
