import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMessages } from './popup-messages';

describe('PopupMessages', () => {
  let component: PopupMessages;
  let fixture: ComponentFixture<PopupMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
