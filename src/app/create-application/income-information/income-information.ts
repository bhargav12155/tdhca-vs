import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { combineLatest } from 'rxjs';
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
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';

import {
  ApplicationDataService,
  HouseholdMember,
} from '../application-data.service';
import { DateUtilService } from '../../shared/services/date-util.service';

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
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
  ],
  templateUrl: './income-information.html',
  styleUrls: ['./income-information.scss'],
})
export class IncomeInformationComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  incomeForm: FormGroup;
  householdMembers: HouseholdMember[] = [];

  payFrequencies = [
    { value: 'weekly', viewValue: 'Weekly' },
    { value: 'bi-weekly', viewValue: 'Bi-weekly' },
    { value: 'monthly', viewValue: 'Monthly' },
  ];

  private frequencyFieldsMap: { [key: string]: number } = {
    weekly: 5, // Should show 5 fields
    'bi-weekly': 2,
    monthly: 1,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private applicationDataService: ApplicationDataService,
    private dateUtilService: DateUtilService,
    private cdr: ChangeDetectorRef
  ) {
    this.incomeForm = this.fb.group({
      householdMembers: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.applicationDataService.currentPersonalInfo,
      this.applicationDataService.currentHouseholdMembers,
    ]).subscribe(([personalInfo, householdMembers]) => {
      const allMembers: HouseholdMember[] = [];

      if (personalInfo) {
        allMembers.push(personalInfo);
      }

      allMembers.push(...householdMembers);

      this.householdMembers = allMembers;
      const memberFGs = allMembers.map((member) => this.createMemberIncomeGroup(member));
      this.incomeForm.setControl('householdMembers', this.fb.array(memberFGs));
      this.cdr.detectChanges();
    });
  }

  createMemberIncomeGroup(member: HouseholdMember): FormGroup {
    // Always create all 5 pay and date fields, regardless of frequency
    const group = this.fb.group({
      // Member details from previous step (read-only)
      firstName: [member.firstName, Validators.required],
      lastName: [member.lastName, Validators.required],
      dob: [this.dateUtilService.formatDate(new Date(member.dob || ''))],

      // Income details - always include all 5 pay fields
      payFrequency: ['weekly', Validators.required],
      pay1: [null],
      date1: [null],
      pay2: [null],
      date2: [null],
      pay3: [null],
      date3: [null],
      pay4: [null],
      date4: [null],
      pay5: [null],
      date5: [null],
      totalIncome: [{ value: 0, disabled: true }],
    });

    // Add listeners to update total income when pay values change
    const payControls = ['pay1', 'pay2', 'pay3', 'pay4', 'pay5'];
    payControls.forEach((controlName) => {
      group.get(controlName)?.valueChanges.subscribe(() => {
        this.updateTotalIncome(group);
      });
    });

    // Update total income when frequency changes
    group.get('payFrequency')?.valueChanges.subscribe(() => {
      this.updateTotalIncome(group);
    });

    return group;
  }

  get householdIncomes(): FormArray {
    return this.incomeForm.get('householdMembers') as FormArray;
  }

  getMemberDisplayName(index: number): string {
    const member = this.householdIncomes.at(index).value;
    return `${member.firstName} ${member.lastName}`;
  }

  getMemberDOB(index: number): string {
    return this.householdIncomes.at(index).value.dob;
  }

  getMemberAge(index: number): number {
    const dob = this.householdIncomes.at(index).value.dob;
    return this.dateUtilService.calculateAge(dob);
  }

  getMemberTotalIncome(index: number): number {
    return this.householdIncomes.at(index).get('totalIncome')?.value || 0;
  }

  // This function now simply checks if the field number is less than or equal to
  // the number of fields required by the currently selected frequency
  isPayFieldVisible(memberIndex: number, fieldNumber: number): boolean {
    const memberGroup = this.householdIncomes.at(memberIndex) as FormGroup;
    const frequency = memberGroup.get('payFrequency')?.value;
    const numberOfFields = this.frequencyFieldsMap[frequency] || 0;
    return fieldNumber <= numberOfFields;
  }

  updateTotalIncome(memberGroup: FormGroup): void {
    const frequency = memberGroup.get('payFrequency')?.value;
    const numberOfFields = this.frequencyFieldsMap[frequency] || 0;
    let total = 0;
    
    for (let i = 1; i <= numberOfFields; i++) {
      const payValue = memberGroup.get(`pay${i}`)?.value;
      if (typeof payValue === 'number' && !isNaN(payValue)) {
        total += payValue;
      }
    }
    
    memberGroup.get('totalIncome')?.setValue(total);
  }

  expandAll(): void {
    this.accordion.openAll();
  }

  collapseAll(): void {
    this.accordion.closeAll();
  }

  onSaveAndContinue(): void {
    if (this.incomeForm.invalid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const incomeData = this.incomeForm.getRawValue();
    this.applicationDataService.setIncomeInformation(incomeData.householdMembers);

    this.snackBar.open('Income information saved successfully!', 'Close', {
      duration: 2000,
    });

    this.router.navigate(['/createapplication/declaration-income']);
  }

  onBack(): void {
    this.router.navigate(['/createapplication/household-members']);
  }
}