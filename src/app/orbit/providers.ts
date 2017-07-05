import { APP_INITIALIZER, Provider } from '@angular/core';
import Coordinator, { Strategy } from '@orbit/coordinator';
import { Bucket } from '@orbit/core';
import { KeyMap, Schema, Source } from '@orbit/data';
import Store from '@orbit/store';

import { createBucket } from './bucket';
import { createCoordinator, initializeCoordinator } from './coordinator';
import { DATA_SOURCE_PROVIDERS } from './data-sources';
import { DATA_STRATEGY_PROVIDERS } from './data-strategies';
import { createSchema } from './schema';
import { createStore } from './store';

export const ORBIT_PROVIDERS: Provider[] = [
  KeyMap,
  { provide: Bucket, useFactory: createBucket },
  { provide: Schema, useFactory: createSchema },
  { provide: Store, useFactory: createStore, deps: [ Bucket, KeyMap, Schema ] },
  { provide: Source, useExisting: Store, multi: true },
  DATA_SOURCE_PROVIDERS,
  DATA_STRATEGY_PROVIDERS,
  { provide: Coordinator, useFactory: createCoordinator, deps: [ Source, Strategy ] },
  { provide: APP_INITIALIZER, useFactory: initializeCoordinator, deps: [ Coordinator ], multi: true },
];
