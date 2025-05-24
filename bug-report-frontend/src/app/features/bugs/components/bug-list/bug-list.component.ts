import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BugsService } from '../../services/bugs.service';
import { Bug } from '../../models/bug.model';

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
    MatProgressSpinnerModule
  ]
})
export class BugListComponent implements OnInit {
  bugs: Bug[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private bugsService: BugsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBugs();
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

  onBugClick(bug: Bug): void {
    this.router.navigate(['/bugs', bug.id]);
  }

  onCreateBug(): void {
    this.router.navigate(['/bugs/create']);
  }
}
