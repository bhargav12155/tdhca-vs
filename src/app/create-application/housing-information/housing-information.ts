import { Component } from '@angular/core';
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
  ],
  templateUrl: './housing-information.html',
  styleUrl: './housing-information.scss',
})
export class HousingInformationComponent {
  housingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private popupMessageService: PopupMessageService
  ) {
    this.housingForm = this.fb.group({
      housingType: ['', Validators.required],
      monthlyPayment: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onBack(): void {
    this.router.navigate(['/createapplication/declaration-income']);
  }

  onSaveAndContinue(): void {
    if (this.housingForm.valid) {
      console.log('Form Saved:', this.housingForm.value);
      // In a real app, you would save the data to a service
      this.router.navigate(['/createapplication/save-verification']);
    } else {
      this.popupMessageService.error('Please fill out all required fields.');
    }
  }
}
