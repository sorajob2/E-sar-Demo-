import { TestBed } from '@angular/core/testing';

import { StrategicPlanService } from './strategic-plan.service';

describe('StrategicPlanService', () => {
  let service: StrategicPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategicPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
