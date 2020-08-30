import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeVerificationComponent } from './income-verification.component';

describe('IncomeVerificationComponent', () => {
  let component: IncomeVerificationComponent;
  let fixture: ComponentFixture<IncomeVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
