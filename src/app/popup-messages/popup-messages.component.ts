import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import {
  PopupMessage,
  PopupMessageService,
} from '../shared/services/popup-message.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-popup-messages',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './popup-messages.html',
  styleUrls: ['./popup-messages.scss'],
  animations: [
    trigger('messageState', [
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('void => visible', [
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
        }),
        animate('300ms ease-out'),
      ]),
      transition('visible => void', [
        animate(
          '300ms ease-in',
          style({
            opacity: 0,
            transform: 'translateY(20px)',
          })
        ),
      ]),
    ]),
  ],
})
export class PopupMessagesComponent implements OnInit, OnDestroy {
  messages: { message: PopupMessage; state: 'visible' }[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private popupMessageService: PopupMessageService) {}

  ngOnInit(): void {
    this.subscription = this.popupMessageService.message$.subscribe(
      (message: PopupMessage) => {
        this.addMessage(message);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addMessage(message: PopupMessage): void {
    this.messages.push({ message, state: 'visible' });
    if (message.duration) {
      setTimeout(() => this.removeMessage(message), message.duration);
    }
  }

  removeMessage(message: PopupMessage): void {
    this.messages = this.messages.filter((msg) => msg.message !== message);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }
}
