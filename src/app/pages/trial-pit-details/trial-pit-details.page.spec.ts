import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrialPitDetailsPage } from './trial-pit-details.page';

describe('TrialPitDetailsPage', () => {
  let component: TrialPitDetailsPage;
  let fixture: ComponentFixture<TrialPitDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialPitDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
