import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveVerification } from './save-verification';

describe('SaveVerification', () => {
  let component: SaveVerification;
  let fixture: ComponentFixture<SaveVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
