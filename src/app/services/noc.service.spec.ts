import { TestBed } from '@angular/core/testing';

import { NocService } from './noc.service';

describe('NocService', () => {
  let service: NocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
