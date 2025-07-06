import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdForm } from './household-form';

describe('HouseholdForm', () => {
  let component: HouseholdForm;
  let fixture: ComponentFixture<HouseholdForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
