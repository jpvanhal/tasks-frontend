import { RequestStrategy } from '@orbit/coordinator';
import { Query, Source, FindRecord, QueryExpression, ClientError, RecordIdentity } from '@orbit/data';
import Store from '@orbit/store';

function isFindRecord(queryExpression: QueryExpression): queryExpression is FindRecord {
  return queryExpression.op === 'findRecord';
}

export function createRemotePullFailStrategy(): RequestStrategy {
  return new RequestStrategy({
    name: 'remote-pull-fail',

    source: 'remote',
    on: 'pullFail',

    action(this: RequestStrategy, query: Query, e: any): void {
      const remote: Source = this.coordinator.getSource('remote');
      const store: Store = <Store>this.coordinator.getSource('store');

      const ignore = () => {
        remote.requestQueue.skip();
      }

      const removeRecord = (record: RecordIdentity) => {
        store.update((t) => [t.removeRecord(record)]);
        ignore();
      };

      if (e instanceof ClientError) {
        const response: Response = (<any>e).response
        if (response.status === 404 && isFindRecord(query.expression)) {
          return removeRecord(query.expression.record);
        }
      }

      ignore();
    },

    blocking: true,
  });
}
