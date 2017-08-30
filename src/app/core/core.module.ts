import { NgModule, Optional, SkipSelf } from '@angular/core';

import { OrbitModule } from '../orbit';
import { LiveQueryService } from './live-query.service';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  imports: [
    OrbitModule,
  ],
  providers: [
    LiveQueryService,
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
