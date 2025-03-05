import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildingInspectionDetailsPage } from './building-inspection-details.page';

describe('BuildingInspectionDetailsPage', () => {
  let component: BuildingInspectionDetailsPage;
  let fixture: ComponentFixture<BuildingInspectionDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingInspectionDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
