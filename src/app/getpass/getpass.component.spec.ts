import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetpassComponent } from './getpass.component';

describe('GetpassComponent', () => {
  let component: GetpassComponent;
  let fixture: ComponentFixture<GetpassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetpassComponent]
    });
    fixture = TestBed.createComponent(GetpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
