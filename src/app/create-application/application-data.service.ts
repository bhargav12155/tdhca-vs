import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface HouseholdMember {
  firstName?: string;
  middleName?: string;
  middleInitial?: string;
  lastName?: string;
  relationship?: string;
  gender?: string;
  disabilityStatus?: string;
  dob?: string | Date;
  race?: string;
  ethnicity?: string;
  educationStatus?: string;
  employmentStatus?: string;
  militaryStatus?: string;
  seasonalWork?: boolean;
  citizenship?: string;
  identity?: string;
  fileName?: string;
  file?: any;
  isSelf?: boolean;
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
