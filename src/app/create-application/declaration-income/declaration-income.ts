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
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-declaration-income',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './declaration-income.html',
  styleUrl: './declaration-income.scss',
})
export class DeclarationIncomeComponent {
  declarationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.declarationForm = this.fb.group({
      agree: [false, Validators.requiredTrue],
      signature: ['', Validators.required],
    });
  }

  onBack(): void {
    this.router.navigate(['/createapplication/income-information']);
  }

  onSaveAndContinue(): void {
    if (this.declarationForm.valid) {
      console.log('Form Saved:', this.declarationForm.value);
      // In a real app, you would save the data to a service
      this.router.navigate(['/createapplication/housing-information']);
    } else {
      this.snackBar.open(
        'Please agree to the terms and provide a signature.',
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }
}
