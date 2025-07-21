import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateUtilService {
  /**
   * Format date input to MM/DD/YYYY format
   * @param value - Raw input value
   * @returns Formatted date string
   */
  formatDateInput(value: string): string {
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

  /**
   * Calculate age from date string in MM/DD/YYYY format
   * @param dateString - Date in MM/DD/YYYY format
   * @returns Age in years
   */
  calculateAge(dateString: string): number {
    if (!dateString || dateString.length < 10) return 0;

    const [month, day, year] = dateString.split('/').map(Number);
    if (
      !month ||
      !day ||
      !year ||
      year < 1900 ||
      year > new Date().getFullYear()
    )
      return 0;

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    // Check if the date is valid
    if (
      birthDate.getMonth() !== month - 1 ||
      birthDate.getDate() !== day ||
      birthDate.getFullYear() !== year
    ) {
      return 0; // Invalid date
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Validate if a date string is in valid MM/DD/YYYY format
   * @param dateString - Date string to validate
   * @returns True if valid, false otherwise
   */
  isValidDate(dateString: string): boolean {
    if (!dateString || dateString.length !== 10) return false;

    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dateRegex.test(dateString)) return false;

    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date.getFullYear() === year &&
      year >= 1900 &&
      year <= new Date().getFullYear() + 1
    );
  }

  /**
   * Convert MM/DD/YYYY string to Date object
   * @param dateString - Date in MM/DD/YYYY format
   * @returns Date object or null if invalid
   */
  parseDate(dateString: string): Date | null {
    if (!this.isValidDate(dateString)) return null;

    const [month, day, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Convert Date object to MM/DD/YYYY string
   * @param date - Date object
   * @returns Formatted date string
   */
  formatDate(date: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${month}/${day}/${year}`;
  }
}
