import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-create-application',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    RouterModule,
    MatSidenavModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-application.html',
  styleUrl: './create-application.scss',
})
export class CreateApplicationComponent {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  private _formBuilder = inject(FormBuilder);

  // Stepper configuration for sidebar
  steps = [
    { label: 'Personal Information', route: 'personal-info' },
    { label: 'Household Members', route: 'household-members' },
    { label: 'Categorical Eligibility', route: 'categorical-eligibility' },
    { label: 'Income Information', route: 'income-information' },
    {
      label: 'Declaration of Income Statement',
      route: 'declaration-income-statement',
    },
    { label: 'Housing Information', route: 'housing-information' },
    { label: 'SAVE System Verification', route: 'save-system-verification' },
    { label: 'Utility Service', route: 'utility-service' },
    { label: 'Document Upload', route: 'document-upload' },
    { label: 'Application Submission', route: 'application-submission' },
  ];

  constructor() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  isActiveStep(route: string): boolean {
    // Checks if the current route matches the step route
    return location.pathname.endsWith(route);
  }

  isStepCompleted(index: number): boolean {
    // For demo: mark all previous steps as completed
    const currentIndex = this.steps.findIndex((step) =>
      this.isActiveStep(step.route)
    );
    return index < currentIndex;
  }
}
