import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface HouseholdMember {
  firstName?: string;
  middleName?: string;
  middleInitial?: string;
  lastName?: string;
  relationship?: string;
  gender?: string;
  disabilityStatus?: string; // Now available for all household members
  dob?: string | Date;
  race?: string;
  ethnicity?: string;
  educationStatus?: string;
  employmentStatus?: string;
  militaryStatus?: string;
  seasonalWork?: string; // Changed from boolean to string (Yes/No)
  citizenshipIdentity?: string; // Combined citizenship and identity field
  documentType?: string; // Type of document being uploaded
  fileName?: string;
  file?: any;
  isSelf?: boolean;
  // Assistance Type Selection (only for head of household)
  energyAssistance?: boolean;
  heatingCoolingAssistance?: boolean;
  supportiveServicesAssistance?: boolean;
  weatherizationAssistance?: boolean;
}

export interface PayDetails {
  id?: any; // To track new vs. existing records
  incomeSource: string;
  frequency: number;
  pay1: number;
  date1: string;
  pay2: number;
  date2: string;
  pay3: number;
  date3: string;
  pay4: number;
  date4: string;
  totalIncome: number;
}

export interface MemberIncomeInfo {
  memberIndex: number;
  memberName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  payDetails: PayDetails[];
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationDataService {
  private personalInfoSource = new BehaviorSubject<HouseholdMember | null>(
    null
  );
  currentPersonalInfo = this.personalInfoSource.asObservable();

  private householdMembersSource = new BehaviorSubject<HouseholdMember[]>([]);
  currentHouseholdMembers = this.householdMembersSource.asObservable();

  private incomeInformationSource = new BehaviorSubject<MemberIncomeInfo[]>([]);
  currentIncomeInformation = this.incomeInformationSource.asObservable();

  constructor() {
    // Load saved data from localStorage on service initialization
    this.loadSavedData();
  }

  private isBrowser(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  private loadSavedData(): void {
    if (!this.isBrowser()) return;
    // Load personal info
    const savedPersonalInfo = localStorage.getItem('tdhca_personal_info');
    if (savedPersonalInfo) {
      this.personalInfoSource.next(JSON.parse(savedPersonalInfo));
    }

    // Load household members
    const savedHouseholdMembers = localStorage.getItem(
      'tdhca_household_members'
    );
    if (savedHouseholdMembers) {
      this.householdMembersSource.next(JSON.parse(savedHouseholdMembers));
    }

    // Load income information
    const savedIncomeInfo = localStorage.getItem('tdhca_income_information');
    if (savedIncomeInfo) {
      this.incomeInformationSource.next(JSON.parse(savedIncomeInfo));
    }
  }

  setPersonalInfo(info: HouseholdMember | null) {
    this.personalInfoSource.next(info);
    // Save to localStorage
    if (this.isBrowser()) {
      if (info) {
        localStorage.setItem('tdhca_personal_info', JSON.stringify(info));
      } else {
        localStorage.removeItem('tdhca_personal_info');
      }
    }
  }

  setHouseholdMembers(members: HouseholdMember[]) {
    this.householdMembersSource.next(members);
    // Save to localStorage
    if (this.isBrowser()) {
      localStorage.setItem('tdhca_household_members', JSON.stringify(members));
    }
  }

  setIncomeInformation(incomeInfo: MemberIncomeInfo[]) {
    this.incomeInformationSource.next(incomeInfo);
    // Save to localStorage
    if (this.isBrowser()) {
      localStorage.setItem(
        'tdhca_income_information',
        JSON.stringify(incomeInfo)
      );
    }
  }

  clearAllData(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('tdhca_personal_info');
      localStorage.removeItem('tdhca_household_members');
      localStorage.removeItem('tdhca_income_information');
    }
    this.personalInfoSource.next(null);
    this.householdMembersSource.next([]);
    this.incomeInformationSource.next([]);
  }
}
