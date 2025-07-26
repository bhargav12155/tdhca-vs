import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Observable source
  private notificationSource = new Subject<Notification>();
  
  // Observable stream
  notification$ = this.notificationSource.asObservable();

  constructor() { }

  /**
   * Show a success notification
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 3000ms)
   */
  success(message: string, duration: number = 3000): void {
    this.showNotification({
      message,
      type: 'success',
      duration
    });
  }

  /**
   * Show an error notification
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 5000ms)
   */
  error(message: string, duration: number = 5000): void {
    this.showNotification({
      message,
      type: 'error',
      duration
    });
  }

  /**
   * Show a warning notification
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 4000ms)
   */
  warning(message: string, duration: number = 4000): void {
    this.showNotification({
      message,
      type: 'warning',
      duration
    });
  }

  /**
   * Show an info notification
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 3000ms)
   */
  info(message: string, duration: number = 3000): void {
    this.showNotification({
      message,
      type: 'info',
      duration
    });
  }

  private showNotification(notification: Notification): void {
    this.notificationSource.next(notification);
  }
}