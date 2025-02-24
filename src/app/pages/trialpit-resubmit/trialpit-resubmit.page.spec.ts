import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrialpitResubmitPage } from './trialpit-resubmit.page';

describe('TrialpitResubmitPage', () => {
  let component: TrialpitResubmitPage;
  let fixture: ComponentFixture<TrialpitResubmitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialpitResubmitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
