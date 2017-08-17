import { RequestStrategy } from '@orbit/coordinator';
import { Query } from '@orbit/data';

export function createStoreRemoteQueryOptimisticStrategy() {
  return new RequestStrategy({
    name: 'store-remote-query-optimistic',

    source: 'store',
    on: 'beforeQuery',

    target: 'remote',
    action(this: RequestStrategy, query: Query) {
      return (<any>this.target).pull(query).catch(() => {
        // FIXME: Swallow all rejections. The errors are handled in the pullFail strategy.
        // See: https://github.com/orbitjs/orbit/issues/451
      });
    },

    blocking: false,
  });
}
