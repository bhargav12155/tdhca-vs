import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountModal } from './create-account-modal';

describe('CreateAccountModal', () => {
  let component: CreateAccountModal;
  let fixture: ComponentFixture<CreateAccountModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccountModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
