import { APP_INITIALIZER, Provider } from '@angular/core';

import { createBucket } from './bucket';
import { createCoordinator, initializeCoordinator } from './coordinator';
import { DATA_SOURCE_PROVIDERS } from './data-sources';
import { DATA_STRATEGY_PROVIDERS } from './data-strategies';
import { createSchema } from './schema';
import { createStore } from './store';
import { BUCKET, COORDINATOR, SCHEMA, SOURCE, STORE, STRATEGY } from './tokens';

export const ORBIT_PROVIDERS: Provider[] = [
  { provide: BUCKET, useFactory: createBucket },
  { provide: SCHEMA, useFactory: createSchema },
  { provide: STORE, useFactory: createStore, deps: [ BUCKET, SCHEMA ] },
  { provide: SOURCE, useExisting: STORE, multi: true },
  DATA_SOURCE_PROVIDERS,
  DATA_STRATEGY_PROVIDERS,
  { provide: COORDINATOR, useFactory: createCoordinator, deps: [ SOURCE, STRATEGY ] },
  { provide: APP_INITIALIZER, useFactory: initializeCoordinator, deps: [ COORDINATOR ], multi: true },
];
