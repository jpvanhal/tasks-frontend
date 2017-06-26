import { Schema } from '@orbit/data';

import { KeyMapService } from './key-map.service';
import { SchemaService } from './schema.service';
import { StoreService } from './store.service';

export function storeServiceFactory(keyMapService: KeyMapService, schemaService: SchemaService) {
  const storeService = new StoreService(keyMapService, schemaService);
  const tasks = [
    { title: 'Meeting with Peter', completed: false, created: '2017-06-16T00:00:00.000Z' },
    { title: 'Buy a shampoo', completed: false, created: '2017-06-19T00:00:00.000Z' },
    { title: 'Call Jana', completed: true, created: '2017-06-21T00:00:00.000Z' },
    { title: 'Weekly goals', completed: false, created: '2017-06-22T00:00:00.000Z' },
  ]
  tasks
    .map((task) => ({ id: storeService.schema.generateId('task'), type: 'task', attributes: task }))
    .forEach((task) => storeService.cache.patch(t => t.addRecord(task)));
  return storeService;
}

export const storeServiceProvider = {
  provide: StoreService,
  useFactory: storeServiceFactory,
  deps: [ KeyMapService, SchemaService ],
};


