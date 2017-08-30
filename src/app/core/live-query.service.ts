import { Inject, Injectable } from '@angular/core';
import { buildQuery, QueryOrExpression } from '@orbit/data';
import Store from '@orbit/store';
import { Observable } from 'rxjs/Observable';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operator/map';
import { startWith } from 'rxjs/operator/startWith';

import { STORE } from '../orbit';


@Injectable()
export class LiveQueryService {
  constructor(@Inject(STORE) private store: Store) { }

  query(queryOrExpression: QueryOrExpression, options?: object, id?: string): Observable<any> {
    const query = buildQuery(queryOrExpression, options, id, this.store.queryBuilder);

    this.store.query(query);

    const patch$ = fromEventPattern(
      (handler) => this.store.cache.on('patch', handler),
      (handler) => this.store.cache.off('patch', handler),
    );
    const reset$ = fromEventPattern(
      (handler) => this.store.cache.on('reset', handler),
      (handler) => this.store.cache.off('reset', handler),
    );
    const change$ = merge(patch$, reset$);
    const liveResults$ = map.call(change$, () => this.store.cache.query(query));
    return startWith.call(liveResults$, this.store.cache.query(query));
  }
}
