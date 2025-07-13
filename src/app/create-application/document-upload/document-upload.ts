import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
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
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatSnackBarModule,
  ],
  templateUrl: './document-upload.html',
  styleUrl: './document-upload.scss',
})
export class DocumentUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  documentForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.documentForm = this.fb.group({
      documents: [null, Validators.required],
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    this.documentForm.patchValue({ documents: this.selectedFiles });
  }

  onBack(): void {
    this.router.navigate(['/createapplication/utility-service']);
  }

  onSaveAndContinue(): void {
    if (this.documentForm.valid) {
      console.log('Form Saved:', this.documentForm.value);
      // In a real app, you would save the data to a service
      this.router.navigate(['/createapplication/application-submission']);
    } else {
      this.snackBar.open('Please upload the required documents.', 'Close', {
        duration: 3000,
      });
    }
  }
}
