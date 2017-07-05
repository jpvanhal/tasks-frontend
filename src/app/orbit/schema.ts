import { Schema } from '@orbit/data';

export function createSchema() {
  return new Schema({
    models: {
      task: {
        keys: {
          remoteId: {}
        },
        attributes: {
          title: { type: 'string' },
          isCompleted: { type: 'boolean' },
          createdAt: { type: 'date' },
        },
      },
    },
  });
}
