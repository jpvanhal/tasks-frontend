import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeyMapService } from './key-map.service';
import { LiveQueryService } from './live-query.service';
import { schemaServiceProvider } from './schema.service.provider';
import { storeServiceProvider } from './store.service.provider';

@NgModule({
  imports: [],
  declarations: [],
  providers: [
    KeyMapService,
    LiveQueryService,
    schemaServiceProvider,
    storeServiceProvider,
  ]
})
export class OrbitModule { }
