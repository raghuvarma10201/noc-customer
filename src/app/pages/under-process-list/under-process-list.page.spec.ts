import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnderProcessListPage } from './under-process-list.page';

describe('UnderProcessListPage', () => {
  let component: UnderProcessListPage;
  let fixture: ComponentFixture<UnderProcessListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderProcessListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
