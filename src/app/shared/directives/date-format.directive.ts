import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateFormat]',
  standalone: true,
})
export class DateFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedDate = this.formatDateInput(input.value);
    if (formattedDate !== input.value) {
      input.value = formattedDate;
      // Trigger input event to update form control
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    // Allow: backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode === 65 && event.ctrlKey === true) ||
      (event.keyCode === 67 && event.ctrlKey === true) ||
      (event.keyCode === 86 && event.ctrlKey === true) ||
      (event.keyCode === 88 && event.ctrlKey === true) ||
      // Allow: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)
    ) {
      return;
    }

    // Ensure that it is a number and stop the keypress
    if (
      (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
      (event.keyCode < 96 || event.keyCode > 105)
    ) {
      event.preventDefault();
    }

    // Prevent typing if already at max length (10 chars for MM/DD/YYYY)
    if (input.value.length >= 10) {
      event.preventDefault();
    }
  }

  private formatDateInput(value: string): string {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');

    // Don't format if empty or just one digit
    if (digitsOnly.length === 0) return '';
    if (digitsOnly.length === 1) return digitsOnly;

    // Add slashes at appropriate positions
    let formatted = '';
    for (let i = 0; i < digitsOnly.length && i < 8; i++) {
      if (i === 2 || i === 4) {
        formatted += '/';
      }
      formatted += digitsOnly[i];
    }

    return formatted;
  }
}
