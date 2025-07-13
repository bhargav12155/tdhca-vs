import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApplicationDataService } from '../application-data.service';

@Component({
  selector: 'app-income-information',
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
  templateUrl: './income-information.html',
  styleUrl: './income-information.scss',
})
export class IncomeInformationComponent implements OnInit {
  incomeForm: FormGroup;
  householdMembers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private applicationDataService: ApplicationDataService
  ) {
    this.incomeForm = this.fb.group({
      householdIncomes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.applicationDataService.currentPersonalInfo.subscribe(
      (personalInfo) => {
        // This is a simplified representation. In a real app, you'd get the full household list.
        if (personalInfo) {
          this.householdMembers = [personalInfo]; // Just using the applicant for now
          this.populateIncomes();
        }
      }
    );
  }

  get householdIncomes(): FormArray {
    return this.incomeForm.get('householdIncomes') as FormArray;
  }

  populateIncomes(): void {
    this.householdMembers.forEach(() => {
      this.householdIncomes.push(this.createIncomeGroup());
    });
  }

  createIncomeGroup(): FormGroup {
    return this.fb.group({
      source: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  getMemberName(index: number): string {
    if (this.householdMembers[index]) {
      const member = this.householdMembers[index];
      return `${member.firstName} ${member.lastName}`;
    }
    return `Member ${index + 1}`;
  }

  onBack(): void {
    this.router.navigate(['/createapplication/categorical-eligibility']);
  }

  onSaveAndContinue(): void {
    if (this.incomeForm.valid) {
      console.log('Form Saved:', this.incomeForm.value);
      // In a real app, you would save the data to a service
      this.router.navigate(['/createapplication/declaration-income']);
    } else {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
      });
    }
  }
}
