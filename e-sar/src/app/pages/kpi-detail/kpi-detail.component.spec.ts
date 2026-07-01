import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDetailComponent } from './kpi-detail.component';

describe('KpiDetailComponent', () => {
  let component: KpiDetailComponent;
  let fixture: ComponentFixture<KpiDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
