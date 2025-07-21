import { Component, OnInit, ViewChild } from '@angular/core';
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
  MemberIncomeInfo,
  PayDetails,
  HouseholdMember,
} from '../application-data.service';
import { DateUtilService } from '../../shared/services/date-util.service';
import { DateFormatDirective } from '../../shared/directives/date-format.directive';

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
    DateFormatDirective,
  ],
  templateUrl: './income-information.html',
  styleUrls: ['./income-information.scss'],
})
export class IncomeInformationComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  incomeForm: FormGroup;
  householdMembers: any[] = [];
  expandedMembers: Set<number> = new Set();

  frequencyOptions = [
    { value: 1, label: 'Once a month' },
    { value: 2, label: 'Twice a month' },
    { value: 3, label: 'Every two weeks' },
    { value: 4, label: 'Every week' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private applicationDataService: ApplicationDataService,
    private dateUtil: DateUtilService
  ) {
    this.incomeForm = this.fb.group({
      householdMembers: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadHouseholdMembers();
    this.loadSavedIncomeData();
  }

  // Template helpers required by the HTML
  get householdIncomes(): FormArray {
    return this.incomeForm.get('householdMembers') as FormArray;
  }

  getMemberDisplayName(i: number): string {
    const member = this.householdMembers[i];
    if (!member) return '';
    return `${member.firstName || ''} ${member.lastName || ''}`.trim();
  }

  getMemberDOB(i: number): string {
    const member = this.householdMembers[i];
    return member?.dateOfBirth || '';
  }

  getMemberAge(i: number): string {
    const member = this.householdMembers[i];
    return member?.age?.toString() || '';
  }

  getMemberTotalIncome(i: number): number {
    const payDetails = this.getPayDetails(i);
    if (!payDetails || !Array.isArray(payDetails.controls)) return 0;
    return payDetails.controls.reduce((sum: number, group: any) => {
      return sum + (Number(group.get('totalIncome')?.value) || 0);
    }, 0);
  }

  getPayDetails(memberIndex: number): FormArray {
    const membersFormArray = this.incomeForm.get(
      'householdMembers'
    ) as FormArray;
    if (membersFormArray && membersFormArray.at(memberIndex)) {
      return membersFormArray.at(memberIndex).get('payDetails') as FormArray;
    }
    return this.fb.array([]);
  }

  isMemberExpanded(memberIndex: number): boolean {
    return this.expandedMembers.has(memberIndex);
  }

  expandAll(): void {
    this.expandedMembers = new Set(
      this.householdMembers.map((_: any, i: number) => i)
    );
  }

  collapseAll(): void {
    this.expandedMembers.clear();
  }

  addNewPayDetails(memberIndex: number): void {
    const payDetailsArray = this.getPayDetails(memberIndex);
    if (payDetailsArray) {
      const newPayDetail = this.fb.group({
        frequency: [1, Validators.required],
        totalIncome: [{ value: 0, disabled: true }],
      });

      // Set up frequency change subscription
      newPayDetail.get('frequency')?.valueChanges.subscribe(() => {
        this.setupPayFieldsFromFrequency(newPayDetail);
      });

      // Initially set up fields for frequency 1
      this.setupPayFieldsFromFrequency(newPayDetail);

      payDetailsArray.push(newPayDetail);
    }
  }

  removePayDetail(memberIndex: number, payIndex: number): void {
    const payDetailsArray = this.getPayDetails(memberIndex);
    if (payDetailsArray && payDetailsArray.length > 1) {
      payDetailsArray.removeAt(payIndex);
    }
  }

  addNewHouseholdMember(): void {
    const membersFormArray = this.incomeForm.get(
      'householdMembers'
    ) as FormArray;

    // Create a new member object
    const newMember = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      age: 0,
    };

    // Add to householdMembers array
    this.householdMembers.push(newMember);

    // Create form group for the new member
    const memberGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      age: [{ value: '', disabled: true }],
      payDetails: this.fb.array([]),
    });

    // Add to form array
    membersFormArray.push(memberGroup);

    // Add initial pay details for the new member
    const newMemberIndex = membersFormArray.length - 1;
    this.addNewPayDetails(newMemberIndex);

    // Expand the new member panel
    this.expandedMembers.add(newMemberIndex);

    // Show success message
    this.snackBar.open('New household member added successfully!', 'Close', {
      duration: 3000,
    });
  }

  removeHouseholdMember(memberIndex: number): void {
    if (this.householdMembers.length > 1) {
      const membersFormArray = this.incomeForm.get(
        'householdMembers'
      ) as FormArray;

      // Remove from householdMembers array
      this.householdMembers.splice(memberIndex, 1);

      // Remove from form array
      membersFormArray.removeAt(memberIndex);

      // Update expanded members set (adjust indices)
      const newExpandedMembers = new Set<number>();
      this.expandedMembers.forEach((index) => {
        if (index < memberIndex) {
          newExpandedMembers.add(index);
        } else if (index > memberIndex) {
          newExpandedMembers.add(index - 1);
        }
      });
      this.expandedMembers = newExpandedMembers;

      // Show success message
      this.snackBar.open('Household member removed successfully!', 'Close', {
        duration: 3000,
      });
    } else {
      this.snackBar.open(
        'At least one household member is required!',
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }

  onFrequencyChange(memberIndex: number, payIndex: number): void {
    const payDetailsArray = this.getPayDetails(memberIndex);
    const payGroup = payDetailsArray.at(payIndex) as FormGroup;
    this.setupPayFieldsFromFrequency(payGroup);
  }

  onPayInput(
    event: any,
    memberIndex: number,
    payIndex: number,
    payField: string
  ): void {
    const value = event.target.value;
    const payDetailsArray = this.getPayDetails(memberIndex);
    const payGroup = payDetailsArray.at(payIndex) as FormGroup;

    console.log(`Pay input for ${payField}:`, value); // Debug logging

    if (payGroup) {
      const control = payGroup.get(payField);
      if (control && !control.disabled) {
        control.setValue(value ? parseFloat(value) : null);
        this.updateTotalIncome(memberIndex, payIndex);
      }
    }
  }

  onPayFocus(event: any): void {
    console.log('Pay field focused', event.target?.value); // Debug logging
  }

  onPayBlur(
    event: any,
    memberIndex: number,
    payIndex: number,
    payField: string
  ): void {
    console.log(
      `Pay field ${payField} blurred with value:`,
      event.target?.value
    ); // Debug logging
    this.updateTotalIncome(memberIndex, payIndex);
  }

  onDOBInput(event: any, memberIndex: number): void {
    const input = event.target;
    const formattedDate = this.dateUtil.formatDateInput(input.value);
    if (formattedDate !== input.value) {
      input.value = formattedDate;
      // Update the form control with the formatted value
      const memberGroup = this.householdIncomes.at(memberIndex) as FormGroup;
      memberGroup.get('dateOfBirth')?.setValue(formattedDate);
    }
  }

  onDateOfBirthChange(memberIndex: number): void {
    const memberGroup = this.householdIncomes.at(memberIndex) as FormGroup;
    const dobValue = memberGroup.get('dateOfBirth')?.value;
    if (dobValue) {
      // Calculate age based on the entered date
      const age = this.dateUtil.calculateAge(dobValue);
      memberGroup.get('age')?.setValue(age);
    }
  }

  // Method to handle date input for pay dates
  onPayDateInput(
    event: any,
    memberIndex: number,
    payIndex: number,
    dateField: string
  ): void {
    const input = event.target;
    const formattedDate = this.dateUtil.formatDateInput(input.value);
    if (formattedDate !== input.value) {
      input.value = formattedDate;
      // Update the form control with the formatted value
      const payDetailsArray = this.getPayDetails(memberIndex);
      const payGroup = payDetailsArray.at(payIndex) as FormGroup;
      payGroup.get(dateField)?.setValue(formattedDate);
    }
  }

  onSaveAndContinue(): void {
    if (this.incomeForm.valid) {
      this.applicationDataService.setIncomeInformation(
        this.incomeForm.value.householdMembers
      );
      console.log('Form data:', this.incomeForm.value);
      this.snackBar.open('Income information saved successfully!', 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/createapplication/declaration-income']);
    } else {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
      });
    }
  }

  onBack(): void {
    this.applicationDataService.setIncomeInformation(
      this.incomeForm.value.householdMembers
    );
    this.router.navigate(['/createapplication/categorical-eligibility']);
  }

  // Private helper methods
  private loadHouseholdMembers(): void {
    // Combine personal info (head of household) with other household members
    this.applicationDataService.currentPersonalInfo.subscribe(
      (personalInfo: HouseholdMember | null) => {
        this.applicationDataService.currentHouseholdMembers.subscribe(
          (members: HouseholdMember[]) => {
            // Start with an empty array
            this.householdMembers = [];

            // Add head of household from personal info if it exists
            if (personalInfo) {
              const dobValue = personalInfo.dob || '';
              const ageValue = this.dateUtil.calculateAge(dobValue.toString());
              this.householdMembers.push({
                ...personalInfo,
                dateOfBirth: dobValue.toString(),
                age: ageValue,
                isExpanded: false,
              } as any);
            }

            // Add other household members
            if (members && members.length > 0) {
              this.householdMembers.push(
                ...members.map((member: HouseholdMember) => {
                  const dobValue = member.dob || '';
                  const ageValue = this.dateUtil.calculateAge(
                    dobValue.toString()
                  );
                  return {
                    ...member,
                    dateOfBirth: dobValue.toString(),
                    age: ageValue,
                    isExpanded: false,
                  } as any;
                })
              );
            }

            // Clear existing form array
            const membersFormArray = this.incomeForm.get(
              'householdMembers'
            ) as FormArray;
            while (membersFormArray.length !== 0) {
              membersFormArray.removeAt(0);
            }

            // Create form groups for all members
            this.householdMembers.forEach((member) => {
              const memberGroup = this.fb.group({
                firstName: [member.firstName || '', Validators.required],
                lastName: [member.lastName || '', Validators.required],
                dateOfBirth: [member.dateOfBirth || '', Validators.required],
                age: [{ value: member.age || '', disabled: true }],
                payDetails: this.fb.array([]),
              });
              membersFormArray.push(memberGroup);

              // Add one initial pay detail for each member
              this.addNewPayDetails(membersFormArray.length - 1);
            });

            // Load any saved income data
            this.loadSavedIncomeData();
          }
        );
      }
    );
  }

  private loadSavedIncomeData(): void {
    setTimeout(() => {
      this.applicationDataService.currentIncomeInformation.subscribe(
        (savedData) => {
          if (!savedData || savedData.length === 0) return;

          const membersFormArray = this.incomeForm.get(
            'householdMembers'
          ) as FormArray;

          savedData.forEach((savedMember: MemberIncomeInfo, index: number) => {
            const memberGroup = membersFormArray.at(index) as FormGroup;
            if (memberGroup && savedMember.payDetails) {
              const payDetailsArray = memberGroup.get(
                'payDetails'
              ) as FormArray;
              payDetailsArray.clear();

              savedMember.payDetails.forEach((savedPayDetail: PayDetails) => {
                const payDetailGroup = this.fb.group({
                  frequency: [savedPayDetail.frequency, Validators.required],
                  pay1: [savedPayDetail.pay1],
                  date1: [savedPayDetail.date1],
                  pay2: [savedPayDetail.pay2],
                  date2: [savedPayDetail.date2],
                  pay3: [savedPayDetail.pay3],
                  date3: [savedPayDetail.date3],
                  pay4: [savedPayDetail.pay4],
                  date4: [savedPayDetail.date4],
                  totalIncome: [
                    { value: savedPayDetail.totalIncome, disabled: true },
                  ],
                });

                this.setupPayFieldsFromFrequency(payDetailGroup);
                payDetailsArray.push(payDetailGroup);
              });
            }
          });
        }
      );
    }, 100);
  }

  private setupPayFieldsFromFrequency(payGroup: FormGroup): void {
    const frequency = payGroup.get('frequency')?.value || 1;

    // Instead of disabling, we'll remove the controls and recreate only the needed ones
    const currentControls = [
      'pay1',
      'date1',
      'pay2',
      'date2',
      'pay3',
      'date3',
      'pay4',
      'date4',
    ];

    // Remove all pay and date controls first
    currentControls.forEach((controlName) => {
      if (payGroup.contains(controlName)) {
        payGroup.removeControl(controlName);
      }
    });

    // Add back only the controls we need based on frequency
    for (let i = 1; i <= frequency; i++) {
      payGroup.addControl(`pay${i}`, this.fb.control(null));
      payGroup.addControl(`date${i}`, this.fb.control(null));
    }

    this.updateTotalIncomeForPayGroup(payGroup);
  }

  private updateTotalIncome(memberIndex: number, payIndex: number): void {
    const payDetailsArray = this.getPayDetails(memberIndex);
    const payGroup = payDetailsArray.at(payIndex) as FormGroup;
    this.updateTotalIncomeForPayGroup(payGroup);
  }

  private updateTotalIncomeForPayGroup(payGroup: FormGroup): void {
    const frequency = payGroup.get('frequency')?.value || 1;
    let total = 0;

    for (let i = 1; i <= frequency; i++) {
      const payControl = payGroup.get(`pay${i}`);
      if (payControl) {
        const payValue = payControl.value;
        if (typeof payValue === 'number' && !isNaN(payValue)) {
          total += payValue;
        }
      }
    }

    payGroup.get('totalIncome')?.setValue(total);
  }
}
