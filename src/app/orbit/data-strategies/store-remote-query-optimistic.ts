import { RequestStrategy } from '@orbit/coordinator';
import { buildQuery, FindRecords, Query, QueryExpression } from '@orbit/data';

export function createStoreRemoteQueryOptimisticStrategy() {
  return new RequestStrategy({
    name: 'store-remote-query-optimistic',

    source: 'store',
    on: 'beforeQuery',

    target: 'remote',
    action(this: RequestStrategy, query: Query) {
      if (query.expression.op === 'findRecords') {
        const expression: FindRecords = {
          page: <any>{
            size: 0,
          },
          ...<FindRecords>query.expression
        };
        query = buildQuery(expression);
      }
      return (<any>this.target).pull(query).catch(() => {
        // FIXME: Swallow all rejections. The errors are handled in the pullFail strategy.
        // See: https://github.com/orbitjs/orbit/issues/451
      });
    },

    blocking: false,
  });
}
