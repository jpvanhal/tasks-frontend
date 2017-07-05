import { Bucket } from '@orbit/core';
import { KeyMap, Schema } from '@orbit/data';
import Store from '@orbit/store';

export function createStore(bucket: Bucket, keyMap: KeyMap, schema: Schema) {
  return new Store({ bucket, keyMap, schema });
}
