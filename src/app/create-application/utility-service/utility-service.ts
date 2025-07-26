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
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-utility-service',
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
  templateUrl: './utility-service.html',
  styleUrl: './utility-service.scss',
})
export class UtilityServiceComponent {
  utilityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private popupMessageService: PopupMessageService
  ) {
    this.utilityForm = this.fb.group({
      provider: ['', Validators.required],
      accountNumber: ['', Validators.required],
    });
  }

  onBack(): void {
    this.router.navigate(['/createapplication/save-verification']);
  }

  onSaveAndContinue(): void {
    if (this.utilityForm.valid) {
      console.log('Form Saved:', this.utilityForm.value);
      // In a real app, you would save the data to a service
      this.router.navigate(['/createapplication/document-upload']);
    } else {
      this.popupMessageService.error('Please fill out all required fields.');
    }
  }
}
