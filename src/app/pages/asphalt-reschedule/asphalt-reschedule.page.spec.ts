import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsphaltReschedulePage } from './asphalt-reschedule.page';

describe('AsphaltReschedulePage', () => {
  let component: AsphaltReschedulePage;
  let fixture: ComponentFixture<AsphaltReschedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsphaltReschedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
