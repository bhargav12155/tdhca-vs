import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupMessageService } from '../../shared/services/popup-message.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-save-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './save-verification.html',
  styleUrl: './save-verification.scss',
})
export class SaveVerificationComponent {
  saveForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private popupMessageService: PopupMessageService
  ) {
    this.saveForm = this.fb.group({
      alienNumber: [''],
    });
  }

  onBack(): void {
    this.router.navigate(['/createapplication/housing-information']);
  }

  onSaveAndContinue(): void {
    if (this.saveForm.valid) {
      console.log('Form Saved:', this.saveForm.value);
      // In a real app, you would save the data to a service
      this.router.navigate(['/createapplication/utility-service']);
    } else {
      this.popupMessageService.error('Please fill out all required fields.');
    }
  }
}
