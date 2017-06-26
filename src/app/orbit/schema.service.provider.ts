import { Schema } from '@orbit/data';

import { SchemaService } from './schema.service';

export function schemaServiceFactory() {
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

export const schemaServiceProvider = {
  provide: SchemaService,
  useFactory: schemaServiceFactory,
  deps: [],
};
