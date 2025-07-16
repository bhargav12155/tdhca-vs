import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-categorical-eligibility',
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
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './categorical-eligibility.html',
  styleUrl: './categorical-eligibility.scss',
})
export class CategoricalEligibilityComponent {
  eligibilityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.eligibilityForm = this.fb.group({
      // Naveen's benefits
      naveen_snap: [false],
      naveen_ssi: [false],
      naveen_tanf: [false],
      naveen_veteran: [false],

      // Uday's benefits
      uday_snap: [false],
      uday_ssi: [false],
      uday_tanf: [false],
      uday_veteran: [false],

      // Lorriane's benefits
      lorriane_snap: [false],
      lorriane_ssi: [false],
      lorriane_tanf: [false],
      lorriane_veteran: [false],
    });
  }

  onCancel(): void {
    this.router.navigate(['/createapplication/household-members']);
  }

  onSaveAndContinue(): void {
    if (this.eligibilityForm.valid) {
      console.log('Form Saved:', this.eligibilityForm.value);
      // In a real app, you would save the data to a service
      this.router.navigate(['/createapplication/income-information']);
    } else {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
      });
    }
  }
}
