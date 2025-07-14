import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
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
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApplicationDataService } from '../application-data.service';
import { log } from 'console';

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
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './household-members.html',
  styleUrl: './household-members.scss',
})
export class HouseholdMembersComponent implements OnInit, AfterViewInit {
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
  disabilityOptions: string[] = [
    'None',
    'Mobility',
    'Vision',
    'Hearing',
    'Cognitive',
    'Other',
  ];
  citizenshipIdentityOptions: string[] = [
    'U.S. Citizen - Birth Certificate',
    'U.S. Citizen - Passport',
    'U.S. Citizen - Naturalization Certificate',
    'Permanent Resident - Green Card',
    'Work Visa - H1B',
    'Work Visa - L1',
    'Student Visa - F1',
    'Other Legal Document',
  ];
  documentTypeOptions: string[] = [
    "Driver's License",
    'State ID',
    'Passport',
    'Birth Certificate',
    'Social Security Card',
    'Utility Bill',
    'Bank Statement',
    'Employment Letter',
    'Income Statement',
    'Tax Return',
    'Other',
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private applicationDataService: ApplicationDataService
  ) {
    this.householdForm = this.fb.group({
      householdMembers: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.applicationDataService.currentPersonalInfo.subscribe(
      (applicantData) => {
        console.log('Applicant Data:', applicantData);

        if (applicantData && this.householdMembers.length === 0) {
          // Use setTimeout to defer form initialization after change detection
          setTimeout(() => {
            this.initializeFirstMember(applicantData);
          });
        }
      }
    );
  }

  ngAfterViewInit(): void {
    // This lifecycle hook ensures the view is fully initialized
  }

  private initializeFirstMember(applicantData: any): void {
    const memberForm = this.createHouseholdMember();

    // Convert Date object to YYYY-MM-DD string format for date input
    let dobValue = '';
    if (applicantData.dob) {
      if (applicantData.dob instanceof Date) {
        dobValue = applicantData.dob.toISOString().split('T')[0];
      } else if (typeof applicantData.dob === 'string') {
        // Convert MM/DD/YYYY to YYYY-MM-DD
        const dateParts = applicantData.dob.split('/');
        if (dateParts.length === 3) {
          const month = dateParts[0].padStart(2, '0');
          const day = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          dobValue = `${year}-${month}-${day}`;
        } else {
          dobValue = applicantData.dob;
        }
      }
    }

    memberForm.patchValue({
      firstName: applicantData.firstName || '',
      middleName: applicantData.middleName || applicantData.middleInitial || '',
      lastName: applicantData.lastName || '',
      relationship: 'Self',
      gender: applicantData.gender || this.genderOptions[0] || '',
      dob: dobValue,
      disabilityStatus: applicantData.disabilityStatus || 'None',
      race: this.raceOptions[0] || '', // Default to first race option
      ethnicity: this.ethnicityOptions[0] || '', // Default to first ethnicity option
      educationStatus: this.educationOptions[0] || '',
      employmentStatus: this.employmentOptions[0] || '',
      militaryStatus: this.militaryOptions[0] || '',
      seasonalWork: 'No', // Default to No
      citizenshipIdentity: this.citizenshipIdentityOptions[0] || '',
      documentType: '', // No default for document type
      fileName: '',
      file: null,
      isSelf: true,
    });
    memberForm.disable(); // Grey out the form
    this.householdMembers.push(memberForm);
    this.expandedMembers.push(true);
    this.updateRelationshipOptions();
  }

  get householdMembers(): FormArray {
    return this.householdForm.get('householdMembers') as FormArray;
  }

  createHouseholdMember(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      relationship: ['', Validators.required],
      gender: [this.genderOptions[0] || '', Validators.required], // Default to first option
      dob: ['', Validators.required],
      disabilityStatus: [this.disabilityOptions[0] || 'None'], // Default to first option (None)
      race: [this.raceOptions[0] || '', Validators.required], // Default to first option
      ethnicity: [this.ethnicityOptions[0] || '', Validators.required], // Default to first option
      educationStatus: [this.educationOptions[0] || ''], // Default to first option
      employmentStatus: [this.employmentOptions[0] || ''], // Default to first option
      militaryStatus: [this.militaryOptions[0] || ''], // Default to first option
      seasonalWork: ['No'], // Default to No
      citizenshipIdentity: [this.citizenshipIdentityOptions[0] || ''], // Default to first option
      documentType: [''], // Document type selection
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

      // Defer auto-save to avoid change detection issues
      setTimeout(() => {
        this.autoSaveAllMembers();
      });

      this.snackBar.open('New household member added successfully!', 'Close', {
        duration: 3000,
      });
    } else {
      this.snackBar.open(
        'You have reached the maximum of 20 household members.',
        'Close',
        { duration: 3000 }
      );
    }
  }

  autoSaveAllMembers(): void {
    // Auto-save all valid household members
    let savedCount = 0;
    for (let i = 0; i < this.householdMembers.length; i++) {
      const memberForm = this.householdMembers.at(i) as FormGroup;
      if (memberForm.valid) {
        savedCount++;
      }
    }

    if (savedCount > 0) {
      console.log(`Auto-saved ${savedCount} household member(s)`);
    }
  }

  removeHouseholdMember(index: number): void {
    // Prevent deleting the first member if isSelf is true
    if (index === 0 && this.householdMembers.at(0).get('isSelf')?.value) {
      return;
    }

    // Remove focus from the button to prevent accessibility issues
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.blur) {
      activeElement.blur();
    }

    // Use setTimeout to ensure focus has been properly managed before opening dialog
    setTimeout(() => {
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '400px',
        maxWidth: '90vw',
        disableClose: false,
        autoFocus: 'first-tabbable',
        restoreFocus: true,
        hasBackdrop: true,
        panelClass: 'custom-dialog-container',
        data: {
          memberName: `${
            this.householdMembers.at(index).get('firstName')?.value || 'Member'
          } ${
            this.householdMembers.at(index).get('lastName')?.value || index + 1
          }`,
          memberIndex: index + 1,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.householdMembers.removeAt(index);
          this.expandedMembers.splice(index, 1);
          // Defer snackbar to avoid change detection issues
          setTimeout(() => {
            this.snackBar.open(
              'Household member deleted successfully.',
              'Close',
              {
                duration: 3000,
              }
            );
          });
        }
      });
    }, 0);
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

  getFileDisplayName(index: number): string {
    const member = this.householdMembers.at(index);
    const fileName = member.get('fileName')?.value;
    const documentType = member.get('documentType')?.value;

    if (fileName && documentType) {
      return `${documentType}: ${fileName}`;
    } else if (fileName) {
      return fileName;
    }
    return '';
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
      // Defer auto-save to avoid change detection issues
      setTimeout(() => {
        this.autoSaveAllMembers();
      });
    }
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

// Confirmation Dialog Component
@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div
      role="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-content"
    >
      <h2 id="dialog-title" mat-dialog-title>Confirm Delete</h2>
      <mat-dialog-content id="dialog-content">
        <p>
          Are you sure you want to delete <strong>{{ data.memberName }}</strong
          >?
        </p>
        <p>This action cannot be undone.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" aria-label="Cancel deletion">
          Cancel
        </button>
        <button
          mat-raised-button
          color="warn"
          (click)="onConfirm()"
          aria-label="Confirm deletion"
        >
          Delete
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ConfirmDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { memberName: string; memberIndex: number }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
