import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdMembers } from './household-members';

describe('HouseholdMembers', () => {
  let component: HouseholdMembers;
  let fixture: ComponentFixture<HouseholdMembers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdMembers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdMembers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
