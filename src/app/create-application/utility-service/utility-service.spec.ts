import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityService } from './utility-service';

describe('UtilityService', () => {
  let component: UtilityService;
  let fixture: ComponentFixture<UtilityService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilityService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilityService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
