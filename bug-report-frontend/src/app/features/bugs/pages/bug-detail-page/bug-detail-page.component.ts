import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BugsService } from '../../services/bugs.service';
import { Bug } from '../../models/bug.model';
import { BugDetailComponent } from '../../components/bug-detail/bug-detail.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-bug-detail-page',
  template: `
    <div *ngIf="loading" class="loading">
      <mat-spinner></mat-spinner>
    </div>
    <div *ngIf="error" class="error">
      <mat-error>{{ error }}</mat-error>
      <button mat-button color="primary" (click)="loadBug()">Retry</button>
    </div>
    <app-bug-detail *ngIf="!loading && !error && bug" [bug]="bug"></app-bug-detail>
  `,
  styles: [`
    .loading, .error {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }
    .error {
      flex-direction: column;
      gap: 10px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    BugDetailComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule
  ]
})
export class BugDetailPageComponent implements OnInit {
  bug: Bug | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bugsService: BugsService
  ) { }

  ngOnInit(): void {
    this.loadBug();
  }

  loadBug(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'Invalid bug ID';
      return;
    }

    this.loading = true;
    this.error = null;
    this.bugsService.getBugById(id).subscribe({
      next: (bug) => {
        this.bug = bug;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bug details. Please try again later.';
        this.loading = false;
        console.error('Error loading bug:', err);
      }
    });
  }
} 