import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildingInspectionReschedulePage } from './building-inspection-reschedule.page';

describe('BuildingInspectionReschedulePage', () => {
  let component: BuildingInspectionReschedulePage;
  let fixture: ComponentFixture<BuildingInspectionReschedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingInspectionReschedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
