import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { coordinatorProviders } from './coordinator.provider';
import { backupSourceProvider } from './data-sources/backup-source.provider';
import { KeyMapService } from './key-map.service';
import { LiveQueryService } from './live-query.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { schemaProvider } from './schema.provider';
import { StoreService } from './store.service';

@NgModule({
  providers: [
    backupSourceProvider,
    ...coordinatorProviders,
    KeyMapService,
    LiveQueryService,
    schemaProvider,
    StoreService,
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
