import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrialpitReschedulePage } from './trialpit-reschedule.page';

describe('TrialpitReschedulePage', () => {
  let component: TrialpitReschedulePage;
  let fixture: ComponentFixture<TrialpitReschedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialpitReschedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
