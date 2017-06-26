import { Injectable } from '@angular/core';
import Store from '@orbit/store';

import { KeyMapService } from './key-map.service';
import { SchemaService } from './schema.service';

@Injectable()
export class StoreService extends Store {
  constructor(keyMapService: KeyMapService, schemaService: SchemaService ) {
    super({ keyMap: keyMapService, schema: schemaService });
  }
}
