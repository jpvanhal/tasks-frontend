import { RequestStrategy } from '@orbit/coordinator';

export function createStoreRemoteUpdateOptimisticStrategy() {
  return new RequestStrategy({
    name: 'store-remote-update-optimistic',

    source: 'store',
    on: 'beforeUpdate',

    target: 'remote',
    action: 'push',

    blocking: false,
  });
}
