import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyKpiDetailComponent } from './my-kpi-detail.component';

describe('MyKpiDetailComponent', () => {
  let component: MyKpiDetailComponent;
  let fixture: ComponentFixture<MyKpiDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyKpiDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyKpiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
