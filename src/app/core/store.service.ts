import { Injectable } from '@angular/core';
import Store from '@orbit/store';

import { KeyMapService } from './key-map.service';
import { SchemaService } from './schema.service';

@Injectable()
export class StoreService extends Store {
  constructor(keyMap: KeyMapService, schema: SchemaService ) {
    super({ keyMap, schema });
  }
}
