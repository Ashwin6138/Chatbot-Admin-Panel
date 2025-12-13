import { TestBed } from '@angular/core/testing';

import { Up } from './up';

describe('Up', () => {
  let service: Up;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Up);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
