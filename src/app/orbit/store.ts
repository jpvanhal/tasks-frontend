import { Bucket } from '@orbit/core';
import { Schema } from '@orbit/data';
import Store from '@orbit/store';

export function createStore(bucket: Bucket, schema: Schema) {
  return new Store({ bucket, schema });
}
