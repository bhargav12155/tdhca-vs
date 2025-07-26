import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, timer } from 'rxjs';
import {
  PopupMessageService,
  PopupMessage,
} from '../shared/services/popup-message.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-popup-messages',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './popup-messages.html',
  styleUrl: './popup-messages.scss',
  animations: [
    trigger('messageState', [
      state(
        'void',
        style({
          transform: 'translateY(100%)',
          opacity: 0,
        })
      ),
      state(
        'visible',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      transition('void => visible', animate('200ms ease-out')),
      transition('visible => void', animate('200ms ease-in')),
    ]),
  ],
})
export class PopupMessages implements OnInit, OnDestroy {
  messages: { message: PopupMessage; state: string }[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private popupMessageService: PopupMessageService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.popupMessageService.message$.subscribe((message) => {
        this.showMessage(message);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private showMessage(message: PopupMessage): void {
    // Add message with 'visible' state
    const newMessage = {
      message,
      state: 'visible',
    };

    this.messages.push(newMessage);

    // Log the message to the console
    console.log('New message:', message);

    // Set timer to remove message
    const duration = message.duration || 3000;

    timer(duration).subscribe(() => {
      const index = this.messages.indexOf(newMessage);
      if (index !== -1) {
        this.messages.splice(index, 1);
      }
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }

  closeMessage(index: number): void {
    this.messages.splice(index, 1);
  }

  removeMessage(message: PopupMessage): void {
    const index = this.messages.findIndex((msg) => msg.message === message);
    if (index !== -1) {
      this.messages.splice(index, 1);
    }
  }
}
