import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupMessageService } from '../../shared/services/popup-message.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-application-submission',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatSnackBarModule,
  ],
  templateUrl: './application-submission.html',
  styleUrl: './application-submission.scss',
})
export class ApplicationSubmissionComponent {
  constructor(private router: Router, private snackBar: MatSnackBar, private popupMessageService: PopupMessageService) {}

  onBack(): void {
    this.router.navigate(['/createapplication/document-upload']);
  }

  onSubmit(): void {
    // In a real app, you would submit the application data to a server.
    this.popupMessageService.success('Application submitted successfully!');
    this.router.navigate(['/home']);
  }
}
