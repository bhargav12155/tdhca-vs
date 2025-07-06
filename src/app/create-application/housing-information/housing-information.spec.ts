import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingInformation } from './housing-information';

describe('HousingInformation', () => {
  let component: HousingInformation;
  let fixture: ComponentFixture<HousingInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
