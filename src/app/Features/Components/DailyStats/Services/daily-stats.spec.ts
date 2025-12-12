import { TestBed } from '@angular/core/testing';

import { DailyStats } from './daily-stats';

describe('DailyStats', () => {
  let service: DailyStats;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyStats);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
