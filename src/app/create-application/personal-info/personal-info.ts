import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

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
  ],
})
export class PersonalInfoComponent {
  personalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      middleInitial: [''],
      lastName: ['', Validators.required],
      prefix: [''],
      suffix: [''],
      dob: ['', Validators.required],
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
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
        county: ['', Validators.required],
      }),
    });
  }

  get phones() {
    return this.personalForm.get('phones') as FormArray;
  }

  get mailingAddress(): FormGroup {
    return this.personalForm.get('mailingAddress') as FormGroup;
  }

  get billingAddress(): FormGroup {
    return this.personalForm.get('billingAddress') as FormGroup;
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
}
