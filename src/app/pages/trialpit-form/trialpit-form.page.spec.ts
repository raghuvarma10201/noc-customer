import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrialpitFormPage } from './trialpit-form.page';

describe('TrialpitFormPage', () => {
  let component: TrialpitFormPage;
  let fixture: ComponentFixture<TrialpitFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialpitFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
