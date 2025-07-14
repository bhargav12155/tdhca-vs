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

@Injectable({
  providedIn: 'root',
})
export class ApplicationDataService {
  private personalInfoSource = new BehaviorSubject<HouseholdMember | null>(
    null
  );
  currentPersonalInfo = this.personalInfoSource.asObservable();

  constructor() {}

  setPersonalInfo(info: HouseholdMember | null) {
    this.personalInfoSource.next(info);
  }
}
