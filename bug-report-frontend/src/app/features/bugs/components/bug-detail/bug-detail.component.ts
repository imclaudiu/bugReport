import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BugsService } from '../../services/bugs.service';
import { Bug } from '../../models/bug.model';

@Component({
  selector: 'app-bug-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './bug-detail.component.html',
  styleUrls: ['./bug-detail.component.scss']
})
export class BugDetailComponent implements OnInit {
  @Input() bug: Bug | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bugsService: BugsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !this.bug) {
      this.loadBug(parseInt(id));
    }
  }

  loadBug(id: number): void {
    this.loading = true;
    this.bugsService.getBugById(id).subscribe({
      next: (bug) => {
        this.bug = bug;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bug:', error);
        this.snackBar.open('Failed to load bug details', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'primary';
      case 'in_progress':
        return 'accent';
      case 'resolved':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'primary';
      case 'medium':
        return 'accent';
      case 'high':
        return 'warn';
      default:
        return 'primary';
    }
  }
} 