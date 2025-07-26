import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface PopupMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PopupMessageService {
  // Observable source
  private messageSource = new Subject<PopupMessage>();
  
  // Observable stream
  message$ = this.messageSource.asObservable();

  constructor() { }

  /**
   * Show a success message
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 3000ms)
   */
  success(message: string, duration: number = 3000): void {
    this.showMessage({
      message,
      type: 'success',
      duration
    });
  }

  /**
   * Show an error message
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 5000ms)
   */
  error(message: string, duration: number = 5000): void {
    this.showMessage({
      message,
      type: 'error',
      duration
    });
  }

  /**
   * Show a warning message
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 4000ms)
   */
  warning(message: string, duration: number = 4000): void {
    this.showMessage({
      message,
      type: 'warning',
      duration
    });
  }

  /**
   * Show an info message
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 3000ms)
   */
  info(message: string, duration: number = 3000): void {
    this.showMessage({
      message,
      type: 'info',
      duration
    });
  }

  private showMessage(message: PopupMessage): void {
    this.messageSource.next(message);
  }
}