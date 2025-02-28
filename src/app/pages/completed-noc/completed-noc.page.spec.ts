import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedNocPage } from './completed-noc.page';

describe('CompletedNocPage', () => {
  let component: CompletedNocPage;
  let fixture: ComponentFixture<CompletedNocPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedNocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
