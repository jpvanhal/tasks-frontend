import { async, TestBed } from '@angular/core/testing';
import { Record, Schema } from '@orbit/data';
import Store from '@orbit/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/take';

import { STORE } from '../orbit';
import { LiveQueryService } from './live-query.service';

describe('LiveQueryService', () => {
  let service: LiveQueryService;
  let schema: Schema;
  let store: Store;

  beforeEach(() => {
    schema = new Schema({
      models: {
        planet: {
          attributes: {
            name: { type: 'string' }
          }
        }
      }
    });
    store = new Store({ schema });

    TestBed.configureTestingModule({
      providers: [
        LiveQueryService,
        {
          provide: STORE,
          useValue: store,
        },
      ]
    });

    service = TestBed.get(LiveQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#query', () => {
    let planets$: Observable<Record[]>;

    beforeEach(async(() => {
      store.update((t) => t.addRecord({
        type: 'planet',
        attributes: {
          name: 'Mercury'
        }
      }));
    }));

    beforeEach(() => {
      planets$ = service
        .query((q) => q.findRecords('planet').sort('name'))
        .map((planets) => planets.map((planet) => planet.attributes.name));
    })

    it('should start with query results against the current contents of store cache', (done) => {
      planets$.take(1).subscribe(
        (planets) => {
          expect(planets).toEqual(['Mercury']);
          done();
        },
        (err: any) => {
          fail(err);
          done();
        }
      );
    });

    it('should emit new query results when cache is reset', (done) => {
      planets$.skip(1).take(1).subscribe(
        (planets) => {
          expect(planets).toEqual([]);
          done();
        },
        (err: any) => {
          fail(err);
          done();
        }
      );
      store.cache.reset();
    });

    it('should emit new query results when store is updated', (done) => {
      planets$.skip(1).take(1).subscribe(
        (planets) => {
          expect(planets).toEqual(['Mercury', 'Venus']);
          done();
        },
        (err: any) => {
          fail(err);
          done();
        }
      );
      store.update((t) => t.addRecord({
        type: 'planet',
        attributes: {
          name: 'Venus'
        }
      }));
    });
  })
});
