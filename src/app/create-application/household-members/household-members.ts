import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApplicationDataService } from '../application-data.service';

@Component({
  selector: 'app-household-members',
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
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './household-members.html',
  styleUrl: './household-members.scss',
})
export class HouseholdMembersComponent implements OnInit {
  householdForm: FormGroup;
  expandedMembers: boolean[] = [];
  relationshipOptions: string[] = [
    'Self',
    'Spouse',
    'Child',
    'Parent',
    'Grandparent',
    'Sibling',
    'Other',
  ];
  raceOptions: string[] = [
    'American Indian or Alaska Native',
    'Asian',
    'Black or African American',
    'Native Hawaiian or Other Pacific Islander',
    'White',
    'Other',
  ];
  ethnicityOptions: string[] = ['Hispanic or Latino', 'Not Hispanic or Latino'];
  genderOptions: string[] = ['Male', 'Female', 'Other'];
  educationOptions: string[] = [
    'No Schooling Completed',
    'Nursery School to 4th Grade',
    '5th Grade or 6th Grade',
    '7th Grade or 8th Grade',
    '9th Grade',
    '10th Grade',
    '11th Grade',
    '12th Grade, No Diploma',
    'High School Graduate',
    'GED or Alternative',
    'Some College, Less than 1 Year',
    'Some College, 1 or More Years, No Degree',
    'Associate Degree',
    "Bachelor's Degree",
    "Master's Degree",
    'Professional School Degree',
    'Doctorate Degree',
  ];
  employmentOptions: string[] = [
    'Employed',
    'Unemployed',
    'Not in labor force',
  ];
  militaryOptions: string[] = ['Yes', 'No'];
  citizenshipOptions: string[] = [
    'U.S. Citizen',
    'Permanent Resident',
    'Other',
  ];
  disabilityOptions: string[] = ['Yes', 'No', 'Prefer not to answer'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private applicationDataService: ApplicationDataService
  ) {
    this.householdForm = this.fb.group({
      householdMembers: this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  get householdMembers(): FormArray {
    return this.householdForm.get('householdMembers') as FormArray;
  }

  createHouseholdMember(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      relationship: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      race: ['', Validators.required],
      ethnicity: ['', Validators.required],
      educationStatus: [''],
      employmentStatus: [''],
      militaryStatus: [''],
      seasonalWork: [false],
      citizenship: [''],
      identity: [''],
      disabilityStatus: [''],
      fileName: [''],
      file: [null],
      isSelf: [false],
    });
  }

  addHouseholdMember(): void {
    if (this.householdMembers.length < 20) {
      const memberForm = this.createHouseholdMember();
      this.householdMembers.push(memberForm);
      this.expandedMembers.push(true);
    } else {
      this.snackBar.open(
        'You have reached the maximum of 20 household members.',
        'Close',
        { duration: 3000 }
      );
    }
  }

  removeHouseholdMember(index: number): void {
    this.householdMembers.removeAt(index);
    this.expandedMembers.splice(index, 1);
  }

  copyApplicantToHousehold(): void {
    if (this.householdMembers.length >= 20) {
      this.snackBar.open(
        'You have reached the maximum of 20 household members.',
        'Close',
        { duration: 3000 }
      );
      return;
    }
    if (this.hasSelfMember()) {
      this.snackBar.open(
        'Applicant has already been added as a household member.',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    this.applicationDataService.currentPersonalInfo.subscribe(
      (applicantData) => {
        if (applicantData) {
          const memberForm = this.createHouseholdMember();
          memberForm.patchValue({
            firstName: applicantData.firstName,
            middleName: applicantData.middleInitial,
            lastName: applicantData.lastName,
            relationship: 'Self',
            gender: applicantData.gender,
            dob: applicantData.dob,
            isSelf: true,
          });
          this.householdMembers.insert(0, memberForm); // Insert at the beginning
          this.expandedMembers.unshift(true);
          this.updateRelationshipOptions();
        } else {
          this.snackBar.open('Applicant data is not available.', 'Close', {
            duration: 3000,
          });
        }
      }
    );
  }

  hasSelfMember(): boolean {
    return this.householdMembers.controls.some(
      (control) => control.get('relationship')?.value === 'Self'
    );
  }

  isSelfMember(index: number): boolean {
    return (
      this.householdMembers.at(index).get('relationship')?.value === 'Self'
    );
  }

  toggleMemberExpand(index: number): void {
    this.expandedMembers[index] = !this.expandedMembers[index];
  }

  updateRelationshipOptions(): void {
    if (this.hasSelfMember()) {
      this.relationshipOptions = this.relationshipOptions.filter(
        (option) => option !== 'Self'
      );
    } else {
      if (!this.relationshipOptions.includes('Self')) {
        this.relationshipOptions.unshift('Self');
      }
    }
  }

  triggerMemberFileInput(index: number): void {
    const fileInput = document.getElementById(
      'memberFileInput' + index
    ) as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.householdMembers.at(index).patchValue({
        fileName: file.name,
        file: file,
      });
    }
  }

  saveHouseholdMember(index: number): void {
    const memberForm = this.householdMembers.at(index) as FormGroup;
    if (memberForm.valid) {
      this.snackBar.open(`Member ${index + 1} saved successfully.`, 'Close', {
        duration: 3000,
      });
    } else {
      this.snackBar.open(
        `Please fill all required fields for Member ${index + 1}.`,
        'Close',
        { duration: 3000 }
      );
      memberForm.markAllAsTouched();
    }
  }

  resetHouseholdMember(index: number): void {
    const memberForm = this.householdMembers.at(index) as FormGroup;
    memberForm.reset();
    // Optionally, you can reset the file input as well
    const fileInput = document.getElementById(
      'memberFileInput' + index
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.householdMembers.at(index).patchValue({
      fileName: '',
      file: null,
    });
  }

  onBack(): void {
    this.router.navigate(['/createapplication/personal-info']);
  }

  onSaveAndContinue(): void {
    if (this.householdForm.valid) {
      console.log('Form Saved:', this.householdForm.value);
      // In a real app, you would save the data to a service
      this.router.navigate(['/createapplication/income-information']);
    } else {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
      });
      this.householdForm.markAllAsTouched();
    }
  }
}
