import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BugsService } from '../../services/bugs.service';
import { Bug } from '../../models/bug.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-bug-form',
  templateUrl: './bug-form.component.html',
  styleUrls: ['./bug-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class BugFormComponent implements OnInit {
  @Input() bug?: Bug;
  @Output() submitForm = new EventEmitter<Bug>();
  @Output() cancel = new EventEmitter<void>();
  
  bugForm: FormGroup;
  loading = false;
  isSubmitting = false;
  error: string | null = null;
  
  statusOptions = ['NOT SOLVED', 'SOLVED'];
  availableTags: string[] = ['UI', 'Backend', 'Frontend', 'Database', 'Security', 'Performance', 'Bug', 'Feature'];
  tags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.bugForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['NOT SOLVED', Validators.required],
      assignedTo: [null],
      tagInput: ['']
    });
  }

  ngOnInit(): void {
    if (this.bug) {
      this.bugForm.patchValue({
        title: this.bug.title,
        description: this.bug.description,
        status: this.bug.status,
        assignedTo: this.bug.assignedTo
      });
      this.tags = this.bug.tags || [];
    }
  }

  onSubmit(): void {
    if (this.bugForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = null;
      
      const formValue = this.bugForm.value;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.snackBar.open('User information not found. Please log in again.', 'Close', { duration: 3000 });
        this.isSubmitting = false;
        return;
      }

      const bug: Bug = {
        ...this.bug,
        ...formValue,
        creationDate: this.bug?.creationDate || new Date(),
        updatedAt: new Date(),
        author: this.bug?.author || { id: currentUser.id },
        tags: this.tags
      };
      
      this.submitForm.emit(bug);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  addTag(): void {
    const tagInput = this.bugForm.get('tagInput')?.value?.trim();
    if (tagInput && !this.tags.includes(tagInput)) {
      this.tags.push(tagInput);
      this.bugForm.get('tagInput')?.setValue('');
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  getErrorMessage(controlName: string): string {
    const control = this.bugForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${minLength} characters`;
    }
    return '';
  }
} 