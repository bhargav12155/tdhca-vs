import { Component, OnInit } from '@angular/core';
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
import {
  ApplicationDataService,
  HouseholdMember,
} from '../application-data.service';

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
export class CategoricalEligibilityComponent implements OnInit {
  eligibilityForm: FormGroup;
  householdMembers: HouseholdMember[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private applicationDataService: ApplicationDataService
  ) {
    this.eligibilityForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.applicationDataService.currentHouseholdMembers.subscribe((members) => {
      this.householdMembers = members;
      this.initializeForm();
    });
  }

  private initializeForm(): void {
    const formControls: { [key: string]: boolean } = {};

    this.householdMembers.forEach((member, index) => {
      const memberKey = this.getMemberKey(member, index);
      formControls[`${memberKey}_snap`] = false;
      formControls[`${memberKey}_ssi`] = false;
      formControls[`${memberKey}_tanf`] = false;
      formControls[`${memberKey}_veteran`] = false;
    });

    this.eligibilityForm = this.fb.group(formControls);
  }

  getMemberKey(member: HouseholdMember, index: number): string {
    // Generate a unique key for each member based on their name or index
    const firstName = member.firstName || '';
    const lastName = member.lastName || '';

    if (firstName && lastName) {
      return `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
    } else if (firstName) {
      return `${firstName.toLowerCase()}_${index}`;
    } else {
      return `member_${index}`;
    }
  }

  getMemberDisplayName(member: HouseholdMember): string {
    if (member.firstName && member.lastName) {
      return `${member.firstName} ${member.lastName}`;
    } else if (member.firstName) {
      return member.firstName;
    } else if (member.lastName) {
      return member.lastName;
    } else {
      return 'Unknown Member';
    }
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

  goToHouseholdMembers(): void {
    this.router.navigate(['/createapplication/household-members']);
  }
}
