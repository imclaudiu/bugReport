import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BugsService } from '../../services/bugs.service';
import { Bug, BugStatus, BugPriority } from '../../models/bug.model';
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
    MatIconModule
  ]
})
export class BugFormComponent implements OnInit {
  @Input() bug?: Bug;
  @Output() submitForm = new EventEmitter<Bug>();
  
  bugForm: FormGroup;
  loading = false;
  isSubmitting = false;
  error: string | null = null;
  
  statusOptions = Object.values(BugStatus);
  priorityOptions = Object.values(BugPriority);
  availableTags: string[] = ['UI', 'Backend', 'Frontend', 'Database', 'Security', 'Performance', 'Bug', 'Feature'];
  tags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private bugsService: BugsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.bugForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: [BugStatus.OPEN, Validators.required],
      priority: [BugPriority.MEDIUM, Validators.required],
      assignedTo: [null],
      tagInput: ['']
    });
  }

  ngOnInit(): void {
    if (this.bug) {
      this.bugForm.patchValue(this.bug);
      this.tags = this.bug.tags || [];
    }
  }

  onSubmit(): void {
    if (this.bugForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = null;
      
      const formValue = this.bugForm.value;
      const bug: Bug = {
        ...formValue,
        id: this.bug?.id,
        createdAt: this.bug?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: this.bug?.createdBy || 1, // TODO: Get from auth service
        tags: this.tags
      };
      
      if (this.bug) {
        // Update existing bug
        this.bugsService.updateBug(this.bug.id, bug).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.snackBar.open('Bug updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/bugs']);
          },
          error: (error: Error) => {
            this.isSubmitting = false;
            this.error = error.message || 'Failed to update bug. Please try again.';
            console.error('Error updating bug:', error);
          }
        });
      } else {
        // Create new bug
        this.bugsService.createBug(bug).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.snackBar.open('Bug created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/bugs']);
          },
          error: (error: Error) => {
            this.isSubmitting = false;
            this.error = error.message || 'Failed to create bug. Please try again.';
            console.error('Error creating bug:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/bugs']);
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