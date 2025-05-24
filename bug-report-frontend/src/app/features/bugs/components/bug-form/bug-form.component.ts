import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Bug } from '../../models/bug.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Tag } from '../../../../core/models/tag.model';

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

  statusOptions = [
    { value: 'RECEIVED', label: 'Received' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'SOLVED', label: 'Solved' }
  ];
  availableTags: Tag[] = [
    { name: 'UI' }, { name: 'Backend' }, { name: 'Frontend' }, 
    { name: 'Database' }, { name: 'Security' }, { name: 'Performance' }, 
    { name: 'Bug' }, { name: 'Feature' }
  ];
  selectedTags: Tag[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.bugForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['RECEIVED', Validators.required],
      assignedTo: [null],
      tagInput: [''],
      imageURL: ['']
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
      this.selectedTags = this.bug.tags || [];
    }
  }

  // In your component
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.bugForm.get('imageURL')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        tags: this.selectedTags
      };

      this.submitForm.emit(bug);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  addTag(): void {
    const tagInput = this.bugForm.get('tagInput')?.value?.trim();
    if (tagInput) {
      const newTag: Tag = { name: tagInput };
      if (!this.selectedTags.some(tag => tag.name === tagInput)) {
        this.selectedTags.push(newTag);
        if (!this.availableTags.some(tag => tag.name === tagInput)) {
          this.availableTags.push(newTag);
        }
        this.bugForm.get('tagInput')?.setValue('');
      }
    }
  }

  removeTag(tag: Tag): void {
    this.selectedTags = this.selectedTags.filter(t => t.name !== tag.name);
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
