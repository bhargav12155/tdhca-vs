import { Routes } from '@angular/router';
import { CreateApplicationComponent } from './create-application/create-application';
import { PersonalInfoComponent } from './create-application/personal-info/personal-info';
import { HouseholdMembersComponent } from './create-application/household-members/household-members';
import { HomeComponent } from './home/home.component';
import { HelpComponent } from './help/help.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { CategoricalEligibilityComponent } from './create-application/categorical-eligibility/categorical-eligibility';
import { DeclarationIncomeComponent } from './create-application/declaration-income/declaration-income';
import { HousingInformationComponent } from './create-application/housing-information/housing-information';
import { SaveVerificationComponent } from './create-application/save-verification/save-verification';
import { UtilityServiceComponent } from './create-application/utility-service/utility-service';
import { DocumentUploadComponent } from './create-application/document-upload/document-upload';
import { ApplicationSubmissionComponent } from './create-application/application-submission/application-submission';
import { IncomeInformationComponent } from './create-application/income-information/income-information';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
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
      {
        path: 'categorical-eligibility',
        component: CategoricalEligibilityComponent,
      },
      { path: 'declaration-income', component: DeclarationIncomeComponent },
      { path: 'housing-information', component: HousingInformationComponent },
      { path: 'save-verification', component: SaveVerificationComponent },
      { path: 'utility-service', component: UtilityServiceComponent },
      { path: 'document-upload', component: DocumentUploadComponent },
      {
        path: 'application-submission',
        component: ApplicationSubmissionComponent,
      },
      { path: 'income-information', component: IncomeInformationComponent },
    ],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
];
