import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerActionNocPage } from './customer-action-noc.page';

describe('CustomerActionNocPage', () => {
  let component: CustomerActionNocPage;
  let fixture: ComponentFixture<CustomerActionNocPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerActionNocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
