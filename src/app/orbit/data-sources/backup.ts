import { Bucket } from '@orbit/core';
import { Pullable, Pushable, Resettable, Schema, Source, Syncable } from '@orbit/data';
import IndexedDBSource from '@orbit/indexeddb';

export type BackupSource = Source & Pullable & Pushable & Resettable & Syncable;

export function createBackupSource(bucket: Bucket, schema: Schema): BackupSource {
  return new IndexedDBSource({
    bucket,
    name: 'backup',
    namespace: 'tasks',
    schema,
  });
}
