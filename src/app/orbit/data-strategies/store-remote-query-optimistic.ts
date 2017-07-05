import { RequestStrategy } from '@orbit/coordinator';

export function createStoreRemoteQueryOptimisticStrategy() {
  return new RequestStrategy({
    name: 'store-remote-query-optimistic',

    source: 'store',
    on: 'beforeQuery',

    target: 'remote',
    action: 'pull',

    blocking: false,

    catch(this: RequestStrategy, e: any) {
      console.log('error performing remote.pull', e);
      this.source.requestQueue.skip();
      this.target.requestQueue.skip();

      throw e;
    }
  });
}
