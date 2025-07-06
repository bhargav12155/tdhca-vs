import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoricalEligibility } from './categorical-eligibility';

describe('CategoricalEligibility', () => {
  let component: CategoricalEligibility;
  let fixture: ComponentFixture<CategoricalEligibility>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoricalEligibility]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoricalEligibility);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
