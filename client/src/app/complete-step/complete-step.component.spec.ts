import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteStepComponent } from './complete-step.component';

describe('CreateProcessComponent', () => {
  let component: CompleteStepComponent;
  let fixture: ComponentFixture<CompleteStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
