import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.scss'],
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
})
export class PersonalInfoComponent {
  personalForm: FormGroup;
  maxDate: string;
  minDate: string;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    // Calculate min and max dates
    const today = new Date();
    const maxDate = new Date();
    const minDate = new Date();

    // Set max date to today (can't be born in the future)
    maxDate.setHours(0, 0, 0, 0);
    // Set min date to 100 years ago
    minDate.setFullYear(today.getFullYear() - 100);

    this.maxDate = maxDate.toISOString().split('T')[0];
    this.minDate = minDate.toISOString().split('T')[0];

    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      middleInitial: [''],
      lastName: ['', Validators.required],
      prefix: [''],
      suffix: [''],
      dob: ['', [Validators.required, this.dateValidator()]],
      gender: ['', Validators.required],
      legal_proof: ['', Validators.required],
      legal_proof_doc: ['', Validators.required],
      phones: this.fb.array([this.createPhoneGroup()]),
      email: ['', [Validators.required, Validators.email]],
      mailingAddress: this.fb.group({
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
        county: ['', Validators.required],
      }),
      billingSame: [false],
      billingAddress: this.fb.group({
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
        county: ['', Validators.required],
      }),
    });
  }

  // Date validator function
  private dateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }

      // Enforce strict YYYY-MM-DD format and 4-digit year
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(control.value)) {
        return { invalidFormat: true };
      }

      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if it's a valid date
      if (isNaN(inputDate.getTime())) {
        return { invalidDate: true };
      }

      // Check if year is 4 digits and within min/max
      const year = inputDate.getFullYear();
      if (
        year < Number(this.minDate.substring(0, 4)) ||
        year > Number(this.maxDate.substring(0, 4))
      ) {
        return { yearOutOfRange: true };
      }

      // Check if date is in the future
      if (inputDate > today) {
        return { futureDate: true };
      }

      // Calculate age
      let age = today.getFullYear() - inputDate.getFullYear();
      const monthDiff = today.getMonth() - inputDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < inputDate.getDate())
      ) {
        age--;
      }

      // Check if person is at least 18
      if (age < 18) {
        return { minAge: true };
      }

      // Check if person is under 100 years old
      if (age > 100) {
        return { maxAge: true };
      }

      return null;
    };
  }

  get phones() {
    return this.personalForm.get('phones') as FormArray;
  }

  get mailingAddress(): FormGroup {
    return this.personalForm.get('mailingAddress') as FormGroup;
  }

  get billingAddress(): FormGroup {
    return this.personalForm.get('billingAddress') as FormGroup;
  }

  // --- Household Members Section ---
  get householdMembers(): FormArray {
    return this.personalForm.get('householdMembers') as FormArray;
  }

  relationshipOptions = [
    { value: 'Self', label: 'Self' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Child', label: 'Child' },
    { value: 'Parent', label: 'Parent' },
    { value: 'Sibling', label: 'Sibling' },
    { value: 'Grandparent', label: 'Grandparent' },
    { value: 'Other', label: 'Other' },
  ];
  raceOptions = [
    { value: 'White', label: 'White' },
    { value: 'Black', label: 'Black or African American' },
    { value: 'Asian', label: 'Asian' },
    { value: 'Native', label: 'American Indian or Alaska Native' },
    { value: 'Pacific', label: 'Native Hawaiian or Other Pacific Islander' },
    { value: 'Other', label: 'Other' },
  ];
  ethnicityOptions = [
    { value: 'Hispanic', label: 'Hispanic or Latino' },
    { value: 'NotHispanic', label: 'Not Hispanic or Latino' },
  ];
  educationOptions = [
    { value: 'None', label: 'None' },
    { value: 'SomeHighSchool', label: 'Some High School' },
    { value: 'HighSchoolGrad', label: 'High School Graduate' },
    { value: 'SomeCollege', label: 'Some College' },
    { value: 'CollegeGrad', label: 'College Graduate' },
    { value: 'PostGrad', label: 'Post Graduate' },
  ];
  employmentOptions = [
    { value: 'Employed', label: 'Employed' },
    { value: 'Unemployed', label: 'Unemployed' },
    { value: 'Retired', label: 'Retired' },
    { value: 'Student', label: 'Student' },
    { value: 'Other', label: 'Other' },
  ];
  militaryOptions = [
    { value: 'None', label: 'None' },
    { value: 'Active', label: 'Active Duty' },
    { value: 'Veteran', label: 'Veteran' },
    { value: 'Reserve', label: 'Reserve/National Guard' },
  ];

  // --- Collapsible Household Members ---
  expandedMembers: boolean[] = [];

  // Call this after adding/removing members
  syncExpandedMembers() {
    const len = this.householdMembers.length;
    while (this.expandedMembers.length < len) {
      this.expandedMembers.push(true); // default to expanded
    }
    while (this.expandedMembers.length > len) {
      this.expandedMembers.pop();
    }
  }

  toggleMemberExpand(i: number) {
    this.expandedMembers[i] = !this.expandedMembers[i];
  }

  ngOnInit() {
    // Add householdMembers FormArray to the form if not present
    if (!this.personalForm.contains('householdMembers')) {
      this.personalForm.addControl('householdMembers', this.fb.array([]));
    }
    this.syncExpandedMembers();
  }
  // --- End Collapsible Household Members ---

  createPhoneGroup() {
    return this.fb.group({
      type: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      extension: [''],
      isPrimary: [false],
    });
  }

  addPhone() {
    this.phones.push(this.createPhoneGroup());
  }

  removePhone(index: number) {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  // --- Household Member Extra Fields and Actions ---
  createHouseholdMemberGroup(data?: any): FormGroup {
    const group = this.fb.group({
      firstName: [data?.firstName || '', Validators.required],
      middleName: [data?.middleName || ''],
      lastName: [data?.lastName || '', Validators.required],
      relationship: [data?.relationship || '', Validators.required],
      gender: [data?.gender || '', Validators.required],
      dob: [data?.dob || '', Validators.required],
      age: [{ value: data?.age || '', disabled: true }],
      race: [data?.race || '', Validators.required],
      ethnicity: [data?.ethnicity || '', Validators.required],
      educationStatus: [data?.educationStatus || ''],
      employmentStatus: [data?.employmentStatus || ''],
      militaryStatus: [data?.militaryStatus || ''],
      seasonalWork: [data?.seasonalWork || false],
      citizenship: [data?.citizenship || ''],
      identity: [data?.identity || ''],
      fileName: [data?.fileName || ''],
      file: [data?.file || null],
      disabilityStatus: [data?.disabilityStatus || '', Validators.required],
    });
    group.get('dob')?.valueChanges.subscribe((dob) => {
      group.get('age')?.setValue(this.calculateAge(dob), { emitEvent: false });
    });
    return group;
  }

  onMemberFileChange(event: any, i: number) {
    const file: File = event.target.files[0];
    if (file) {
      this.householdMembers.at(i).patchValue({
        fileName: file.name,
        file: file,
      });
    }
  }

  saveHouseholdMember(i: number) {
    // Implement save logic as needed (e.g., mark as saved, send to API, etc.)
    // For now, just mark as touched
    this.householdMembers.at(i).markAsTouched();
  }

  resetHouseholdMember(i: number) {
    const member = this.householdMembers.at(i);
    const initial = this.createHouseholdMemberGroup().value;
    member.reset(initial);
  }

  addHouseholdMember() {
    if (this.householdMembers.length < 20) {
      this.householdMembers.push(this.createHouseholdMemberGroup());
      this.syncExpandedMembers();
    }
  }

  copyApplicantToHousehold() {
    if (this.hasSelfMember() || this.householdMembers.length >= 20) return;
    const applicant = {
      firstName: this.personalForm.get('firstName')?.value,
      middleName: this.personalForm.get('middleInitial')?.value,
      lastName: this.personalForm.get('lastName')?.value,
      relationship: 'Self',
      gender: this.personalForm.get('gender')?.value,
      dob: this.personalForm.get('dob')?.value,
      age: this.calculateAge(this.personalForm.get('dob')?.value),
      race: '',
      ethnicity: '',
      educationStatus: '',
      employmentStatus: '',
      militaryStatus: '',
      seasonalWork: false,
    };
    this.householdMembers.insert(0, this.createHouseholdMemberGroup(applicant));
    this.syncExpandedMembers();
  }

  removeHouseholdMember(index: number) {
    if (!this.isSelfMember(index)) {
      this.householdMembers.removeAt(index);
      this.syncExpandedMembers();
    }
  }

  hasSelfMember(): boolean {
    return this.householdMembers.controls.some(
      (ctrl) => ctrl.get('relationship')?.value === 'Self'
    );
  }

  isSelfMember(index: number): boolean {
    return (
      this.householdMembers.at(index).get('relationship')?.value === 'Self'
    );
  }

  calculateAge(dob: string): number | '' {
    if (!dob) return '';
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : '';
  }
  // --- End Household Members Section ---

  onSubmit() {
    if (this.personalForm.valid) {
      // handle form submission
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.snackBar.open('Changes canceled', 'Close', {
      duration: 2500,
      verticalPosition: 'top',
    });
  }

  // Helper function to get error message
  getDOBErrorMessage(): string {
    const dobControl = this.personalForm.get('dob');
    if (dobControl?.hasError('required')) {
      return 'Date of Birth is required';
    }
    if (dobControl?.hasError('invalidFormat')) {
      return 'Please use YYYY-MM-DD format with a 4-digit year';
    }
    if (dobControl?.hasError('invalidDate')) {
      return 'Please enter a valid date';
    }
    if (dobControl?.hasError('yearOutOfRange')) {
      return 'Year must be 4 digits and within allowed range';
    }
    if (dobControl?.hasError('futureDate')) {
      return 'Date of Birth cannot be in the future';
    }
    if (dobControl?.hasError('minAge')) {
      return 'Must be at least 18 years old';
    }
    if (dobControl?.hasError('maxAge')) {
      return 'Age cannot exceed 100 years';
    }
    return '';
  }

  fileName = '';

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.personalForm.patchValue({
        legal_proof_file: file,
      });
      this.personalForm.get('legal_proof_file')?.updateValueAndValidity();
    }
  }

  triggerMemberFileInput(i: number) {
    const el = document.getElementById('memberFileInput' + i) as HTMLElement;
    if (el) el.click();
  }
}
