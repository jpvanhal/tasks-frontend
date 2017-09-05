import Orbit, { Bucket } from '@orbit/core';
import { Pullable, Pushable, Schema, Source } from '@orbit/data';
import JSONAPISource from '@orbit/jsonapi';
import { decamelize } from '@orbit/utils';

export type RemoteSource = Source & Pullable & Pushable;

export function createRemoteSource(bucket: Bucket, schema: Schema): RemoteSource {
  const source = new JSONAPISource({
    maxRequestsPerTransform: 1,
    bucket,
    name: 'remote',
    namespace: 'api',
    schema,
    defaultFetchHeaders: {
      'Content-Type': 'application/vnd.api+json',
    },
  });

  source.serializer.resourceType = function(type: string): string {
    return decamelize(this.schema.pluralize(type));
  };

  source.serializer.resourceRelationship = function(_type: string, relationship: string): string {
    return decamelize(relationship);
  };

  source.serializer.resourceAttribute = function(_type: string, attr: string): string {
    return decamelize(attr);
  };

  // Monkeypatch to prevent `TypeError: Cannot read property 'status' of undefined`.
  // See: https://github.com/orbitjs/orbit/pull/450
  const superHandleFetchResponse = (<any>source).handleFetchResponse;
  (<any>source).handleFetchResponse = function(response: any) {
    if (response instanceof Response) {
      return superHandleFetchResponse.call(this, response);
    }
    return Orbit.Promise.resolve();
  };

  return source;
}
