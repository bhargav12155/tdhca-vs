import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApplicationDataService } from '../application-data.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
})
export class PersonalInfoComponent implements OnInit {
  personalForm: FormGroup;
  maxDate: string;
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private applicationDataService: ApplicationDataService
  ) {
    const today = new Date();
    const maxDate = new Date();
    const minDate = new Date();

    maxDate.setHours(0, 0, 0, 0);
    minDate.setFullYear(today.getFullYear() - 100);

    this.maxDate = maxDate.toISOString().split('T')[0];
    this.minDate = minDate.toISOString().split('T')[0];

    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      middleInitial: [''],
      lastName: ['', Validators.required],
      prefix: [''],
      suffix: [''],
      dob: ['', [Validators.required, this.dateValidator()]],
      gender: ['', Validators.required],
      phones: this.fb.array([this.createPhoneGroup()]),
      email: ['', [Validators.required, Validators.email]],
      mailingAddress: this.fb.group({
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
        county: ['', Validators.required],
      }),
      billingSame: [false],
      billingAddress: this.fb.group({
        address1: [''],
        address2: [''],
        city: [''],
        state: [''],
        zip: [''],
        county: [''],
      }),
    });
  }

  ngOnInit() {
    this.personalForm.get('billingSame')?.valueChanges.subscribe((same) => {
      const billingAddress = this.personalForm.get(
        'billingAddress'
      ) as FormGroup;
      if (same) {
        billingAddress.disable();
        Object.keys(billingAddress.controls).forEach((key) => {
          billingAddress.get(key)?.clearValidators();
          billingAddress.get(key)?.updateValueAndValidity();
        });
      } else {
        billingAddress.enable();
        Object.keys(billingAddress.controls).forEach((key) => {
          billingAddress.get(key)?.setValidators([Validators.required]);
          billingAddress.get(key)?.updateValueAndValidity();
        });
      }
      this.updateBillingAddressValidators(same);
    });
    this.phones.controls.forEach((control) => {
      this.setupPhoneFormatting(control as FormGroup);
    });
  }

  setupPhoneFormatting(phoneGroup: FormGroup) {
    const phoneControl = phoneGroup.get('number');
    if (phoneControl) {
      phoneControl.valueChanges.subscribe((value) => {
        if (value) {
          const formatted = this.formatPhoneNumber(value);
          if (formatted !== value) {
            phoneControl.setValue(formatted, { emitEvent: false });
          }
        }
      });
    }
  }

  formatPhoneNumber(value: string): string {
    if (!value) {
      return '';
    }
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length > 10) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6, 10)}`;
    }
    const areaCode = phoneNumber.slice(0, 3);
    const middle = phoneNumber.slice(3, 6);
    const last = phoneNumber.slice(6, 10);

    if (phoneNumber.length > 6) {
      return `(${areaCode}) ${middle}-${last}`;
    } else if (phoneNumber.length > 3) {
      return `(${areaCode}) ${middle}`;
    } else if (phoneNumber.length > 0) {
      return `(${areaCode}`;
    }
    return '';
  }

  dateValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(control.value)) {
        return { invalidFormat: true };
      }

      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(inputDate.getTime())) {
        return { invalidDate: true };
      }

      const year = inputDate.getFullYear();
      if (
        year < new Date(this.minDate).getFullYear() ||
        year > new Date(this.maxDate).getFullYear()
      ) {
        return { yearOutOfRange: true };
      }

      if (inputDate > today) {
        return { futureDate: true };
      }

      let age = today.getFullYear() - inputDate.getFullYear();
      const monthDiff = today.getMonth() - inputDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < inputDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        return { minAge: true };
      }

      if (age > 100) {
        return { maxAge: true };
      }

      return null;
    };
  }

  createPhoneGroup(): FormGroup {
    const phoneGroup = this.fb.group({
      type: ['', Validators.required],
      number: [
        '',
        [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)],
      ],
    });
    this.setupPhoneFormatting(phoneGroup);
    return phoneGroup;
  }

  get phones(): FormArray {
    return this.personalForm.get('phones') as FormArray;
  }

  addPhone() {
    const phoneGroup = this.createPhoneGroup();
    this.phones.push(phoneGroup);
  }

  removePhone(index: number) {
    this.phones.removeAt(index);
  }

  updateBillingAddressValidators(isSame: boolean) {
    const billingAddress = this.personalForm.get('billingAddress') as FormGroup;
    if (isSame) {
      billingAddress.disable();
      Object.keys(billingAddress.controls).forEach((key) => {
        billingAddress.get(key)?.clearValidators();
        billingAddress.get(key)?.updateValueAndValidity();
      });
    } else {
      billingAddress.enable();
      Object.keys(billingAddress.controls).forEach((key) => {
        billingAddress.get(key)?.setValidators([Validators.required]);
        billingAddress.get(key)?.updateValueAndValidity();
      });
    }
  }

  onSaveAndContinue() {
    if (this.personalForm.valid) {
      this.applicationDataService.setPersonalInfo(this.personalForm.value);
      this.router.navigate(['/createapplication/household-members']);
    } else {
      this.snackBar.open('Please fill all required fields.', 'Close', {
        duration: 3000,
      });
      this.markFormGroupTouched(this.personalForm);
    }
  }

  onBack() {
    this.router.navigate(['/home']);
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  getDOBErrorMessage(): string {
    const dobControl = this.personalForm.get('dob');
    if (dobControl?.hasError('required')) {
      return 'Date of Birth is required';
    }
    if (dobControl?.hasError('invalidFormat')) {
      return 'Please use YYYY-MM-DD format';
    }
    if (dobControl?.hasError('invalidDate')) {
      return 'Please enter a valid date';
    }
    if (dobControl?.hasError('yearOutOfRange')) {
      return 'Year is out of the allowed range';
    }
    if (dobControl?.hasError('futureDate')) {
      return 'Date of Birth cannot be in the future';
    }
    if (dobControl?.hasError('minAge')) {
      return 'Must be at least 18 years old';
    }
    if (dobControl?.hasError('maxAge')) {
      return 'Age cannot exceed 100 years';
    }
    return '';
  }
}
