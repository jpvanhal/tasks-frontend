import { Schema } from '@orbit/data';

export function schemaFactory(): Schema {
  return new Schema({
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
