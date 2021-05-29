import { TestBed } from '@angular/core/testing';

import { ViewSummaryGuard } from './view.summary.guard.service';

describe('View.Summary.GuardService', () => {
  let service: ViewSummaryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewSummaryGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
