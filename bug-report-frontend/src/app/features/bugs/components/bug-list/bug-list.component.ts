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
  availableTags: string[] = ['UI', 'Backend', 'Frontend', 'Database', 'Security', 'Performance', 'Bug', 'Feature'];

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
        this.bugs = bugs.sort((a, b) => {
          const dateA = new Date(a.creationDate).getTime();
          const dateB = new Date(b.creationDate).getTime();
          return dateB - dateA;
        });
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

    // If no filters are active, load all bugs
    if (!title && !tag && !userId) {
      this.loadBugs();
      return;
    }

    this.bugsService.filterBugs(title, userId, tag).subscribe({
      next: (bugs) => {
        this.bugs = bugs;
        this.loading = false;
      },
      error: (err) => {
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
