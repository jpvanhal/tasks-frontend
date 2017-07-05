import IndexedDBBucket from '@orbit/indexeddb-bucket';

export function createBucket() {
  return new IndexedDBBucket({ namespace: 'tasks-settings' });
}
