import { Routes } from '@angular/router';
import { CreateApplicationComponent } from './create-application/create-application';
import { PersonalInfoComponent } from './create-application/personal-info/personal-info';
import { HouseholdMembersComponent } from './create-application/household-members/household-members';
import { HomeComponent } from './home/home.component';
import { HelpComponent } from './help/help.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'help',
    component: HelpComponent,
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
