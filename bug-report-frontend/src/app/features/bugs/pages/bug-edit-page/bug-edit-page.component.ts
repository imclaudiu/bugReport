import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BugsService } from '../../services/bugs.service';
import { Bug } from '../../models/bug.model';
import { BugFormComponent } from '../../components/bug-form/bug-form.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-bug-edit-page',
  template: `
    <div class="page-header">
      <h2>Edit Bug</h2>
    </div>
    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>
    <div *ngIf="error" class="error-message">
      {{ error }}
    </div>
    <app-bug-form
      *ngIf="!loading && !error && bug"
      [bug]="bug"
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
    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .error-message {
      color: red;
      padding: 20px;
      text-align: center;
    }
  `],
  standalone: true,
  imports: [CommonModule, BugFormComponent, MatProgressSpinnerModule]
})
export class BugEditPageComponent implements OnInit {
  bug: Bug | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bugsService: BugsService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const bugId = Number(id);
      if (!isNaN(bugId)) {
        this.bugsService.getBugById(bugId).subscribe({
          next: (bug: Bug) => {
            this.bug = bug;
            this.loading = false;
          },
          error: (err: Error) => {
            this.error = 'Error loading bug details';
            this.loading = false;
            console.error('Error loading bug:', err);
          }
        });
      } else {
        this.error = 'Invalid bug ID';
        this.loading = false;
      }
    }
  }

  onSubmit(bug: Bug): void {
    if (this.bug?.id) {
      this.bugsService.updateBug(this.bug.id, bug).subscribe({
        next: (updatedBug) => {
          this.router.navigate(['/bugs', updatedBug.id]);
        },
        error: (err) => {
          console.error('Error updating bug:', err);
          // TODO: Show error message to user
        }
      });
    }
  }

  onCancel(): void {
    if (this.bug?.id) {
      this.router.navigate(['/bugs', this.bug.id]);
    } else {
      this.router.navigate(['/bugs']);
    }
  }
} 