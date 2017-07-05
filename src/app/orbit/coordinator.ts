import Coordinator, { Strategy } from '@orbit/coordinator';
import { Source } from '@orbit/data';

export function createCoordinator(sources: Source[], strategies: Strategy[]) {
  return new Coordinator({ sources, strategies });
}

export function initializeCoordinator(coordinator: Coordinator) {
  return (): Promise<void> => {
    const backup = coordinator.getSource('backup');
    const store = coordinator.getSource('store');

    return backup.pull((q) => q.findRecords())
      .then((transform) => store.sync(transform))
      .then(() => {
        Object.keys(store.schema.models).forEach((type) => {
          const records = store.cache.records(type);
          records.values.forEach((record) => store.keyMap.pushRecord(record));
        });
      })
      .then(() => backup.transformLog.clear())
      .then(() => store.transformLog.clear())
      .then(() => {
        console.log('Key map: ', store.keyMap._data);
      })
      .then(() => coordinator.activate());
  }
}
