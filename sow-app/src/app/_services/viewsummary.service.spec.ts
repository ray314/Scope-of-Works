import { TestBed } from '@angular/core/testing';

import { ViewSummaryService } from './viewsummary.service';

describe('ViewsummaryService', () => {
  let service: ViewSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
