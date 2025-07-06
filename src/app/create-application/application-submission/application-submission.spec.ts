import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSubmission } from './application-submission';

describe('ApplicationSubmission', () => {
  let component: ApplicationSubmission;
  let fixture: ComponentFixture<ApplicationSubmission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationSubmission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationSubmission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
