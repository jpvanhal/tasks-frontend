import { KeyMap, Schema, Source } from '@orbit/data';

import { createBackupSource } from './backup';
import { createRemoteSource } from './remote';

export const DATA_SOURCE_PROVIDERS = [
  { provide: Source, useFactory: createBackupSource, deps: [ Schema ], multi: true },
  { provide: Source, useFactory: createRemoteSource, deps: [ KeyMap, Schema ], multi: true },
];
