import { Injectable } from '@angular/core';
import { Query, QueryOrExpression } from '@orbit/data';
import { Observable } from 'rxjs/Observable';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operator/map';
import { startWith } from 'rxjs/operator/startWith';

import { StoreService } from './store.service';

@Injectable()
export class LiveQueryService {
  constructor(private storeService: StoreService) { }

  query(queryOrExpression: QueryOrExpression, options?: object, id?: string): Observable<any> {
    const query = Query.from(queryOrExpression, options, id, this.storeService.queryBuilder);

    this.storeService.query(query);

    const patch$ = fromEventPattern(
      (handler) => this.storeService.cache.on('patch', handler),
      (handler) => this.storeService.cache.off('patch', handler),
    );
    const reset$ = fromEventPattern(
      (handler) => this.storeService.cache.on('reset', handler),
      (handler) => this.storeService.cache.off('reset', handler),
    );
    const change$ = merge(patch$, reset$);
    const liveResults$ = map.call(change$, () => this.storeService.cache.query(query));
    return startWith.call(liveResults$, this.storeService.cache.query(query));
  }
}
