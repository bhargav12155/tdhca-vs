import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupMessageService } from '../shared/services/popup-message.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  securityQuestions: string[] = [
    'What was the name of your first pet?',
    'What was the name of your elementary school?',
    "What is your mother's maiden name?",
    'What was the model of your first car?',
    'What city were you born in?',
    'What is the name of your favorite teacher?',
    'What was your childhood nickname?',
    'What is the name of your best friend from childhood?',
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private popupMessageService: PopupMessageService
  ) {
    this.registrationForm = this.fb.group(
      {
        // Personal Information
        prefix: [''],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        middleInitial: [''],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        suffix: [''],
        email: ['', [Validators.required, Validators.email]],

        // Password
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],

        // Security Questions
        securityQuestion1: ['', Validators.required],
        securityAnswer1: ['', Validators.required],
        securityQuestion2: ['', Validators.required],
        securityAnswer2: ['', Validators.required],
        securityQuestion3: ['', Validators.required],
        securityAnswer3: ['', Validators.required],

        // Agreement
        agreeToTerms: [false, Validators.requiredTrue],
        agreeToPrivacy: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordValidator(control: any) {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar) {
      return null;
    }

    return {
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  get firstName() {
    return this.registrationForm.get('firstName');
  }
  get lastName() {
    return this.registrationForm.get('lastName');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }
  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }
  get securityQuestion1() {
    return this.registrationForm.get('securityQuestion1');
  }
  get securityAnswer1() {
    return this.registrationForm.get('securityAnswer1');
  }
  get securityQuestion2() {
    return this.registrationForm.get('securityQuestion2');
  }
  get securityAnswer2() {
    return this.registrationForm.get('securityAnswer2');
  }
  get middleInitial() {
    return this.registrationForm.get('middleInitial');
  }
  get prefix() {
    return this.registrationForm.get('prefix');
  }
  get suffix() {
    return this.registrationForm.get('suffix');
  }
  get securityQuestion3() {
    return this.registrationForm.get('securityQuestion3');
  }
  get securityAnswer3() {
    return this.registrationForm.get('securityAnswer3');
  }
  get agreeToTerms() {
    return this.registrationForm.get('agreeToTerms');
  }
  get agreeToPrivacy() {
    return this.registrationForm.get('agreeToPrivacy');
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  getFirstNameErrorMessage(): string {
    if (this.firstName?.hasError('required')) {
      return 'First name is required';
    }
    if (this.firstName?.hasError('minlength')) {
      return 'First name must be at least 2 characters long';
    }
    return '';
  }

  getLastNameErrorMessage(): string {
    if (this.lastName?.hasError('required')) {
      return 'Last name is required';
    }
    if (this.lastName?.hasError('minlength')) {
      return 'Last name must be at least 2 characters long';
    }
    return '';
  }

  getEmailErrorMessage(): string {
    if (this.email?.hasError('required')) {
      return 'Email is required';
    }
    if (this.email?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.password?.hasError('required')) {
      return 'Password is required';
    }
    if (this.password?.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    }
    if (this.password?.hasError('passwordStrength')) {
      return 'Password must contain uppercase, lowercase, numbers, and special characters';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (this.confirmPassword?.hasError('required')) {
      return 'Please confirm your password';
    }
    if (this.confirmPassword?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  getPasswordStrength(): string {
    const password = this.password?.value || '';
    const errors = this.password?.errors?.['passwordStrength'];

    if (!password) return 'none';

    if (!errors) return 'strong';

    const strength = [
      errors.hasUpperCase,
      errors.hasLowerCase,
      errors.hasNumbers,
      errors.hasSpecialChar,
    ].filter(Boolean).length;

    if (strength >= 3) return 'good';
    if (strength >= 2) return 'fair';
    return 'weak';
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;

      // Simulate registration success
      this.popupMessageService.success('Registration successful! Please login with your credentials.');

      console.log('Registration Data:', formData);

      // Navigate to login page with a delay to show success message
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    } else {
      this.popupMessageService.error('Please fill out all required fields correctly.');
      this.registrationForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/login']);
  }

  getAvailableSecurityQuestions(excludeQuestion?: string): string[] {
    return this.securityQuestions.filter((q) => q !== excludeQuestion);
  }
}
