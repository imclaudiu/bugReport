import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BugsService } from '../../services/bugs.service';
import { Bug } from '../../models/bug.model';
import { BugFormComponent } from '../../components/bug-form/bug-form.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bug-create-page',
  template: `
    <div class="page-header">
      <h2>Create New Bug</h2>
    </div>
    <app-bug-form
      (submitForm)="onSubmit($event)"
      (cancel)="onCancel()"
    ></app-bug-form>
  `,
  styles: [`
    .page-header {
      padding: 20px;
      h2 {
        margin: 0;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, BugFormComponent, MatSnackBarModule]
})
export class BugCreatePageComponent {
  constructor(
    private router: Router,
    private bugsService: BugsService,
    private snackBar: MatSnackBar
  ) { }

  onSubmit(bug: Bug): void {
    this.bugsService.createBug(bug).subscribe({
      next: (createdBug) => {
        this.snackBar.open('Bug created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/bugs', createdBug.id]);
      },
      error: (err) => {
        console.error('Error creating bug:', err);
        this.snackBar.open('Failed to create bug. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/bugs']);
  }
} 