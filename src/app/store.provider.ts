import { KeyMap, Schema } from '@orbit/data';
import Store from '@orbit/store';

export function storeFactory(keyMap: KeyMap, schema: Schema) {
  const store = new Store({ keyMap, schema });
  const tasks = [
    { title: 'Meeting with Peter', completed: false, created: '2017-06-16T00:00:00.000Z' },
    { title: 'Buy a shampoo', completed: false, created: '2017-06-19T00:00:00.000Z' },
    { title: 'Call Jana', completed: true, created: '2017-06-21T00:00:00.000Z' },
    { title: 'Weekly goals', completed: false, created: '2017-06-22T00:00:00.000Z' },
  ]
  tasks
    .map((task) => ({ id: store.schema.generateId('task'), type: 'task', attributes: task }))
    .forEach((task) => store.cache.patch(t => t.addRecord(task)));
  return store;
}
