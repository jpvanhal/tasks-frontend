import { TestBed, inject } from '@angular/core/testing';

import { LiveQueryService } from './live-query.service';

describe('LiveQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiveQueryService]
    });
  });

  it('should be created', inject([LiveQueryService], (service: LiveQueryService) => {
    expect(service).toBeTruthy();
  }));
});
