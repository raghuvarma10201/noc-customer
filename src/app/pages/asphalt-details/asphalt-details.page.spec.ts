import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsphaltDetailsPage } from './asphalt-details.page';

describe('AsphaltDetailsPage', () => {
  let component: AsphaltDetailsPage;
  let fixture: ComponentFixture<AsphaltDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsphaltDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
