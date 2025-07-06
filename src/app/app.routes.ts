import { Routes } from '@angular/router';
import { CreateApplicationComponent } from './create-application/create-application';
import { PersonalInfoComponent } from './create-application/personal-info/personal-info';
import { HouseholdMembersComponent } from './create-application/household-members/household-members';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'createapplication/personal-info',
    pathMatch: 'full',
  },
  {
    path: 'createapplication',
    component: CreateApplicationComponent,
    children: [
      { path: '', redirectTo: 'personal-info', pathMatch: 'full' },
      { path: 'personal-info', component: PersonalInfoComponent },
      { path: 'household-members', component: HouseholdMembersComponent },
    ],
  },
];
