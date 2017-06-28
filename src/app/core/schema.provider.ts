import { Provider } from '@angular/core';
import { Schema } from '@orbit/data';

import { SchemaService } from './schema.service';

export function createSchema(): SchemaService {
  return new SchemaService({
    models: {
      task: {
        attributes: {
          title: { type: 'string' },
          completed: { type: 'boolean' },
          created: { type: 'date' },
        },
      },
    },
  });
}

export const schemaProvider: Provider = {
  provide: SchemaService,
  useFactory: createSchema,
  deps: [],
};
