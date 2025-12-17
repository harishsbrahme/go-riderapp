import { TestBed } from '@angular/core/testing';

import { ApiMainService } from './api-main-service';

describe('ApiMainService', () => {
  let service: ApiMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
