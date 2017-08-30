import Coordinator, { Strategy } from '@orbit/coordinator';
import { Source } from '@orbit/data';
import Store from '@orbit/store';

import { BackupSource } from './data-sources/backup';

export function createCoordinator(sources: Source[], strategies: Strategy[]) {
  return new Coordinator({ sources, strategies });
}

export function initializeCoordinator(coordinator: Coordinator) {
  return (): Promise<void> => {
    const backup: BackupSource = <BackupSource>coordinator.getSource('backup');
    const store: Store = <Store>coordinator.getSource('store');

    return backup.pull((q) => q.findRecords())
      .then((transform) => store.sync(transform))
      .then(() => coordinator.activate());
  }
}
