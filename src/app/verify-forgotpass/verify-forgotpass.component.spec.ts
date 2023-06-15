import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyForgotpassComponent } from './verify-forgotpass.component';

describe('VerifyForgotpassComponent', () => {
  let component: VerifyForgotpassComponent;
  let fixture: ComponentFixture<VerifyForgotpassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyForgotpassComponent]
    });
    fixture = TestBed.createComponent(VerifyForgotpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
