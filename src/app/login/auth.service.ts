import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check if user was previously logged in (using localStorage)
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const savedLoginState = localStorage.getItem('isLoggedIn');
      if (savedLoginState === 'true') {
        this.isLoggedInSubject.next(true);
      }
    }
  }

  login(username: string, password: string): boolean {
    // Dummy authentication logic
    const VALID_USERNAME = 'admin';
    const VALID_PASSWORD = 'password';

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      this.isLoggedInSubject.next(true);

      // Only access localStorage in browser environment
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
      }
      return true;
    }

    return false;
  }

  logout(): void {
    this.isLoggedInSubject.next(false);

    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
    }
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getUsername(): string | null {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username');
    }
    return null;
  }
}
