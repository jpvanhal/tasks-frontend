import { ConnectionStrategy } from '@orbit/coordinator';
import { Query, ReplaceRecordOperation, Transform } from '@orbit/data';
import Store from '@orbit/store';
import RecordIdentityMap from '@orbit/store/src/cache/record-identity-map';
import { assert } from '@orbit/utils';

export function createRemotePullStoreEvictionStrategy() {
  return new ConnectionStrategy({
    name: 'remote-pull-store-eviction',
    source: 'remote',
    on: 'pull',

    action(this: ConnectionStrategy, query: Query, result: Transform[]) {
      return new Promise((resolve) => {
        const store: Store = this.coordinator.getSource('store');

        if (query.expression.op !== 'findRecords') {
          return;
        }

        const cachedRecords = new RecordIdentityMap();
        Object.keys(store.schema.models)
          .map((type) => Array.from(store.cache.records(type).values()))
          .forEach((records) => records.forEach((record) => cachedRecords.add(record)));

        assert('Remote did not return exactly one transform for pull().', result.length === 1);
        const transform = result[0];
        const remoteRecords = new RecordIdentityMap();
        transform.operations
          .forEach((operation: ReplaceRecordOperation) => remoteRecords.add(operation.record));

        const evictionCandidates = cachedRecords.exclusiveOf(remoteRecords);
        evictionCandidates.forEach((record) => store.query((q) => q.findRecord(record)));

        resolve(result);
      });
    },

    catch(this: ConnectionStrategy, _query: Query, _result: Transform[], e: any) {
      throw e; // FIXME: handle this better
    }
  });
}
