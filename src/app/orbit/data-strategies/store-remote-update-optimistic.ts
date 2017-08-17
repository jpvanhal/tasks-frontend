import { RequestStrategy, Strategy } from '@orbit/coordinator';
import { Transform } from '@orbit/data';

export function createStoreRemoteUpdateOptimisticStrategy(): Strategy {
  return new RequestStrategy({
    name: 'store-remote-update-optimistic',

    source: 'store',
    on: 'beforeUpdate',

    target: 'remote',
    action(this: RequestStrategy, transform: Transform) {
      return (<any>this.target).push(transform).catch(() => {
        // FIXME: Swallow all rejections. The errors are handled in the pushFail strategy.
        // See: https://github.com/orbitjs/orbit/issues/451
      });
    },

    blocking: false,
  });
}
