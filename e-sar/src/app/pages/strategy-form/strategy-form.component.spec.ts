import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyFormComponent } from './strategy-form.component';

describe('StrategyFormComponent', () => {
  let component: StrategyFormComponent;
  let fixture: ComponentFixture<StrategyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
