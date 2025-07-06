import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeInformation } from './income-information';

describe('IncomeInformation', () => {
  let component: IncomeInformation;
  let fixture: ComponentFixture<IncomeInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
