import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationIncome } from './declaration-income';

describe('DeclarationIncome', () => {
  let component: DeclarationIncome;
  let fixture: ComponentFixture<DeclarationIncome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarationIncome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclarationIncome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
