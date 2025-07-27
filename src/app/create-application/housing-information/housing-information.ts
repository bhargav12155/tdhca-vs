import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupMessageService } from '../../shared/services/popup-message.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-housing-information',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatRadioModule,
  ],
  templateUrl: './housing-information.html',
  styleUrl: './housing-information.scss',
})
export class HousingInformationComponent implements OnInit {
  housingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private popupMessageService: PopupMessageService
  ) {
    this.housingForm = this.fb.group({
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      county: ['', Validators.required],
      homeStatus: ['', Validators.required],
      rentIncludesUtilities: [''],
      landlordName: [''],
      landlordAddress: [''],
      landlordPhone: [''],
      landlordEmail: ['', [Validators.email]],
      dwellingType: ['', Validators.required],
      weatherizationInterest: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.housingForm.get('homeStatus')?.valueChanges.subscribe(value => {
      const rentFields = ['rentIncludesUtilities', 'landlordName', 'landlordAddress', 'landlordPhone', 'landlordEmail'];

      if (value === 'rent') {
        rentFields.forEach(fieldName => {
          this.housingForm.get(fieldName)?.setValidators([Validators.required]);
          this.housingForm.get(fieldName)?.updateValueAndValidity();
        });
      } else {
        rentFields.forEach(fieldName => {
          this.housingForm.get(fieldName)?.clearValidators();
          this.housingForm.get(fieldName)?.updateValueAndValidity();
        });
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/createapplication/declaration-income']);
  }

  onSaveAndContinue(): void {
    if (this.housingForm.valid) {
      console.log('Form Saved:', this.housingForm.value);
      this.router.navigate(['/createapplication/save-verification']);
    } else {
      this.popupMessageService.error('Please fill out all required fields.');
    }
  }
}
