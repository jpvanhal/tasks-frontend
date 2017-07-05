import Orbit from '@orbit/core';
import { KeyMap, Schema } from '@orbit/data';
import JSONAPISource, { JSONAPISerializer } from '@orbit/jsonapi';
import { decamelize } from '@orbit/utils';

export function createRemoteSource(keyMap: KeyMap, schema: Schema) {
  Orbit.fetch = fetch.bind(window);

  const source = new JSONAPISource({
    keyMap,
    name: 'remote',
    namespace: 'api',
    schema,
    defaultFetchHeaders: {
      'Content-Type': 'application/vnd.api+json',
    },
  })

  source.serializer.resourceType = function(type: string): string {
    return decamelize(this.schema.pluralize(type));
  }

  source.serializer.resourceRelationship = function(type: string, relationship: string): string {
    return decamelize(relationship);
  }

  source.serializer.resourceAttribute = function(type: string, attr: string): string {
    return decamelize(attr);
  }

  return source;
}
