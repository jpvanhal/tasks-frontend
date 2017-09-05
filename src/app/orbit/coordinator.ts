import Coordinator, { Strategy } from '@orbit/coordinator';
import { Source } from '@orbit/data';
import Store from '@orbit/store';

import { BackupSource } from './data-sources/backup';
import { RemoteSource } from './data-sources/remote';

export function createCoordinator(sources: Source[], strategies: Strategy[]) {
  return new Coordinator({ sources, strategies });
}

export function initializeCoordinator(coordinator: Coordinator) {
  return (): Promise<void> => {
    const backup: BackupSource = <BackupSource>coordinator.getSource('backup');
    const remote: RemoteSource = <RemoteSource>coordinator.getSource('remote');
    const store: Store = <Store>coordinator.getSource('store');

    remote.requestQueue.autoProcess = false;

    return backup.pull((q) => q.findRecords())
      .then((transform) => store.sync(transform))
      .then(() => coordinator.activate())
      .then(() => {
        remote.requestQueue.autoProcess = true;
        remote.requestQueue.process().catch(() => {
          // FIXME: Swallow all rejections. The errors are handled in the pushFail strategy.
          // See: https://github.com/orbitjs/orbit/issues/451
        });
      });
  }
}
