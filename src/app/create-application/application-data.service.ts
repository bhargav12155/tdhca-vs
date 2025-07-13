import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationDataService {
  private personalInfoSource = new BehaviorSubject<any>(null);
  currentPersonalInfo = this.personalInfoSource.asObservable();

  constructor() {}

  setPersonalInfo(info: any) {
    this.personalInfoSource.next(info);
  }
}
