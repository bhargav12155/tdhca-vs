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
  personalInfo: HouseholdMember | null = null;
  allMembers: HouseholdMember[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private applicationDataService: ApplicationDataService
  ) {
    this.eligibilityForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Get personal info (first person)
    this.applicationDataService.currentPersonalInfo.subscribe(
      (personalInfo) => {
        this.personalInfo = personalInfo;
        this.updateAllMembers();
      }
    );

    // Get household members
    this.applicationDataService.currentHouseholdMembers.subscribe((members) => {
      this.householdMembers = members;
      this.updateAllMembers();
    });
  }

  private updateAllMembers(): void {
    this.allMembers = [];

    // Add personal info as first member if available
    if (this.personalInfo) {
      this.allMembers.push({
        ...this.personalInfo,
        isSelf: true,
      });
    }

    // Add household members (excluding the first one if it's marked as self)
    if (this.householdMembers) {
      const additionalMembers = this.householdMembers.filter(
        (member) => !member.isSelf
      );
      this.allMembers.push(...additionalMembers);
    }

    this.initializeForm();
  }

  private initializeForm(): void {
    const formControls: { [key: string]: boolean } = {};

    this.allMembers.forEach((member, index) => {
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
    const firstName = member.firstName || '';
    const lastName = member.lastName || '';
    const relationship = member.relationship || '';

    let displayName = '';
    if (firstName && lastName) {
      displayName = `${firstName} ${lastName}`;
    } else if (firstName) {
      displayName = firstName;
    } else if (lastName) {
      displayName = lastName;
    } else {
      displayName = 'Unknown Member';
    }

    // Add relationship information for clarity
    if (relationship) {
      displayName += ` (${relationship})`;
    }

    return displayName;
  }

  onSaveAndContinue(): void {
    if (this.eligibilityForm.valid) {
      const formData = this.eligibilityForm.value;
      console.log('Categorical Eligibility Data:', formData);

      // Show success message
      this.snackBar.open(
        'Categorical eligibility information saved successfully!',
        'Close',
        {
          duration: 3000,
          panelClass: ['success-snackbar'],
        }
      );

      // In a real app, you would save the data to a service
      // this.applicationDataService.setCategoricalEligibility(formData);

      this.router.navigate(['/createapplication/income-information']);
    } else {
      this.snackBar.open(
        'Please review the form and correct any errors.',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  onBack(): void {
    this.router.navigate(['/createapplication/household-members']);
  }

  goToHouseholdMembers(): void {
    this.router.navigate(['/createapplication/household-members']);
  }
}
