import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildingInspectionFormPage } from './building-inspection-form.page';

describe('BuildingInspectionFormPage', () => {
  let component: BuildingInspectionFormPage;
  let fixture: ComponentFixture<BuildingInspectionFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingInspectionFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
