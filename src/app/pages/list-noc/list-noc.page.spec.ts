import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListNocPage } from './list-noc.page';

describe('ListNocPage', () => {
  let component: ListNocPage;
  let fixture: ComponentFixture<ListNocPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
