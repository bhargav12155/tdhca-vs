import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class PersonalInfoComponent implements OnInit {
  personalForm: FormGroup;
  maxDate: string;
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Calculate min and max dates
    const today = new Date();
    const maxDate = new Date();
    const minDate = new Date();

    // Set max date to today (can't be born in the future)
    maxDate.setHours(0, 0, 0, 0);
    // Set min date to 100 years ago
    minDate.setFullYear(today.getFullYear() - 100);

    this.maxDate = maxDate.toISOString().split('T')[0];
    this.minDate = minDate.toISOString().split('T')[0];

    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      middleInitial: [''],
      lastName: ['', Validators.required],
      prefix: ['Mr'], // Default to first option
      suffix: ['Jr'], // Default to first option
      dob: ['', [Validators.required, this.dateValidator()]],
      gender: ['Male', Validators.required], // Default to first option
      disabilityStatus: ['None'], // Default to first option
      phones: this.fb.array([this.createPhoneGroup()]),
      email: ['', [Validators.required, Validators.email]],
      residentialAddress: this.fb.group({
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state: ['TX', Validators.required], // Default to first option
        zip: ['', Validators.required],
        county: ['', Validators.required],
      }),
      mailingSame: [false],
      mailingAddress: this.fb.group({
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state: ['TX', Validators.required], // Default to first option
        zip: ['', Validators.required],
        county: ['', Validators.required],
      }),
    });
  }

  ngOnInit() {
    this.personalForm.get('mailingSame')?.valueChanges.subscribe((checked) => {
      if (checked) {
        this.personalForm
          .get('mailingAddress')
          ?.patchValue(this.personalForm.get('residentialAddress')?.value);
        this.personalForm.get('mailingAddress')?.disable({ emitEvent: false });
      } else {
        this.personalForm.get('mailingAddress')?.enable({ emitEvent: false });
      }
    });
  }

  // Date validator function
  private dateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }

      // Enforce strict YYYY-MM-DD format and 4-digit year
      // Accepts MM/DD/YYYY, M/D/YYYY, MM/D/YYYY, M/DD/YYYY, and YYYY-MM-DD
      let inputDate: Date;
      if (control.value instanceof Date) {
        inputDate = control.value;
      } else if (typeof control.value === 'string') {
        // Accepts MM/DD/YYYY, M/D/YYYY, MM/D/YYYY, M/DD/YYYY, and YYYY-MM-DD
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$|^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(control.value)) {
          return { invalidFormat: true };
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(control.value)) {
          inputDate = new Date(control.value);
        } else {
          // MM/DD/YYYY or M/D/YYYY
          const [month, day, year] = control.value.split('/').map(Number);
          inputDate = new Date(year, month - 1, day);
        }
      } else {
        return { invalidFormat: true };
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if it's a valid date
      if (isNaN(inputDate.getTime())) {
        return { invalidDate: true };
      }

      // Check if year is 4 digits and within min/max
      const year = inputDate.getFullYear();
      if (
        year < Number(this.minDate.substring(0, 4)) ||
        year > Number(this.maxDate.substring(0, 4))
      ) {
        return { yearOutOfRange: true };
      }

      // Check if date is in the future
      if (inputDate > today) {
        return { futureDate: true };
      }

      // Calculate age
      let age = today.getFullYear() - inputDate.getFullYear();
      const monthDiff = today.getMonth() - inputDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < inputDate.getDate())
      ) {
        age--;
      }

      // Check if person is at least 18
      if (age < 18) {
        return { minAge: true };
      }

      // Check if person is under 100 years old
      if (age > 100) {
        return { maxAge: true };
      }

      return null;
    };
  }

  get phones() {
    return this.personalForm.get('phones') as FormArray;
  }

  get residentialAddress(): FormGroup {
    return this.personalForm.get('residentialAddress') as FormGroup;
  }

  get mailingAddress(): FormGroup {
    return this.personalForm.get('mailingAddress') as FormGroup;
  }

  createPhoneGroup() {
    return this.fb.group({
      type: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      extension: [''],
      isPrimary: [false],
    });
  }

  addPhone() {
    this.phones.push(this.createPhoneGroup());
  }

  removePhone(index: number) {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  onSubmit() {
    if (this.personalForm.valid) {
      // handle form submission
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.snackBar.open('Changes canceled', 'Close', {
      duration: 2500,
      verticalPosition: 'top',
    });
  }

  onSaveAndContinue() {
    if (this.personalForm.valid) {
      // Save the form data to a service or state management if needed
      // Navigate to the next step
      this.router.navigate(['/createapplication/household-members']);
    } else {
      this.personalForm.markAllAsTouched();
      this.snackBar.open(
        'Please fill out all required fields before continuing.',
        'Close',
        {
          duration: 3000,
          verticalPosition: 'top',
        }
      );
    }
  }

  // Helper function to get error message
  getDOBErrorMessage(): string {
    const dobControl = this.personalForm.get('dob');
    if (dobControl?.hasError('required')) {
      return 'Date of Birth is required';
    }
    if (dobControl?.hasError('invalidFormat')) {
      return 'Please use MM/DD/YYYY format or pick a date from the calendar';
    }
    if (dobControl?.hasError('invalidDate')) {
      return 'Please enter a valid date';
    }
    if (dobControl?.hasError('yearOutOfRange')) {
      return 'Year must be 4 digits and within allowed range';
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

  onBack(): void {
    this.router.navigate(['/createapplication/personal-info']);
  }
}
