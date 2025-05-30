import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { BugsService } from '../../services/bugs.service';
import { Bug } from '../../models/bug.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Tag } from '../../../../core/models/tag.model';

@Component({
  selector: 'app-bug-list',
  templateUrl: './bug-list.component.html',
  styleUrls: ['./bug-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    ReactiveFormsModule
  ]
})
export class BugListComponent implements OnInit {
  bugs: Bug[] = [];
  loading = false;
  error: string | null = null;
  filterForm: FormGroup;
  availableTags: Tag[] = [
    { name: 'UI' }, { name: 'Backend' }, { name: 'Frontend' },
    { name: 'Database' }, { name: 'Security' }, { name: 'Performance' },
    { name: 'Bug' }, { name: 'Feature' }
  ];

  constructor(
    private bugsService: BugsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.filterForm = this.fb.group({
      title: [''],
      tag: [''],
      showOnlyMine: [false]
    });
  }

  ngOnInit(): void {
    this.loadBugs();

    // Subscribe to form changes to trigger filtering
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadBugs(): void {
    this.loading = true;
    this.error = null;
    this.bugsService.getAllBugs().subscribe({
      next: (bugs) => {
        this.bugs = bugs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bugs. Please try again.';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 5000 });
      }
    });
  }

  applyFilters(): void {
    const { title, tag, showOnlyMine } = this.filterForm.value;
    this.loading = true;
    this.error = null;

    let userId: number | undefined;
    if (showOnlyMine) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        userId = currentUser.id;
      } else {
        this.error = 'You must be logged in to view your bugs.';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 5000 });
        return;
      }
    }

    // If only showing user's bugs without other filters
    if (showOnlyMine && !title && !tag) {
      this.bugsService.getBugsByUser(userId!).subscribe({
        next: (bugs) => {
          this.bugs = bugs;
          this.loading = false;
          if (bugs.length === 0) {
            this.snackBar.open('No bugs found matching your criteria', 'Close', { duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Error loading user bugs:', err);
          this.error = 'Failed to load your bugs. Please try again.';
          this.loading = false;
          this.snackBar.open(this.error, 'Close', { duration: 5000 });
        }
      });
      return;
    }

    // If only filtering by tag
    if (tag && !title && !showOnlyMine) {
      this.bugsService.getBugsByTag(tag).subscribe({
        next: (bugs) => {
          this.bugs = bugs;
          this.loading = false;
          if (bugs.length === 0) {
            this.snackBar.open('No bugs found with this tag', 'Close', { duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Error loading bugs by tag:', err);
          this.error = 'Failed to load bugs by tag. Please try again.';
          this.loading = false;
          this.snackBar.open(this.error, 'Close', { duration: 5000 });
        }
      });
      return;
    }

    // If no filters are active, load all bugs
    if (!title && !tag && !userId) {
      this.loadBugs();
      return;
    }

    // Use general filter for other combinations
    this.bugsService.filterBugs(title, userId, tag).subscribe({
      next: (bugs) => {
        this.bugs = bugs;
        this.loading = false;
        if (bugs.length === 0) {
          this.snackBar.open('No bugs found matching your criteria', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error filtering bugs:', err);
        this.error = 'Failed to filter bugs. Please try again.';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 5000 });
      }
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      title: '',
      tag: '',
      showOnlyMine: false
    });
    this.loadBugs();
  }

  onBugClick(bug: Bug): void {
    this.router.navigate(['/bugs', bug.id]);
  }

  onCreateBug(): void {
    this.router.navigate(['/bugs/create']);
  }
}
