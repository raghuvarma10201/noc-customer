import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsphaltFormPage } from './asphalt-form.page';

describe('AsphaltFormPage', () => {
  let component: AsphaltFormPage;
  let fixture: ComponentFixture<AsphaltFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsphaltFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
