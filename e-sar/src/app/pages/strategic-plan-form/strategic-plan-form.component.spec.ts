import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicPlanFormComponent } from './strategic-plan-form.component';

describe('StrategicPlanFormComponent', () => {
  let component: StrategicPlanFormComponent;
  let fixture: ComponentFixture<StrategicPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategicPlanFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategicPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
