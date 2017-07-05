import { Schema } from '@orbit/data';
import IndexedDBSource from '@orbit/indexeddb';

export function createBackupSource(schema: Schema) {
  return new IndexedDBSource({
    name: 'backup',
    namespace: 'tasks',
    schema,
  });
}
