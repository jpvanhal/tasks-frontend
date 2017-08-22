import Coordinator, { Strategy } from '@orbit/coordinator';
import { Pullable, Source } from '@orbit/data';
import Store from '@orbit/store';

export function createCoordinator(sources: Source[], strategies: Strategy[]) {
  return new Coordinator({ sources, strategies });
}

export function initializeCoordinator(coordinator: Coordinator) {
  return (): Promise<void> => {
    const backup: Source & Pullable = coordinator.getSource('backup');
    const store: Store = coordinator.getSource('store');

    return backup.pull((q) => q.findRecords())
      .then((transform) => store.sync(transform))
      .then(() => backup.transformLog.clear())
      .then(() => store.transformLog.clear())
      .then(() => coordinator.activate());
  }
}
