import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanBrowserComponent } from './plan-browser.component';

describe('PlanBrowserComponent', () => {
  let component: PlanBrowserComponent;
  let fixture: ComponentFixture<PlanBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
