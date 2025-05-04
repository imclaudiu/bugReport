import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BugsService } from '../../services/bugs.service';
import { Bug } from '../../models/bug.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bug-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
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
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
        this.bug = {
          ...bug,
          creationDate: new Date(bug.creationDate),
          updatedAt: bug.updatedAt ? new Date(bug.updatedAt) : undefined
        };
        console.log('Loaded bug:', this.bug);
        console.log('Current user:', this.authService.getCurrentUser());
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bug:', error);
        this.snackBar.open('Failed to load bug details', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  canEditBug(): boolean {
    if (!this.bug || !this.bug.author) {
      console.log('Cannot edit: No bug or author');
      return false;
    }
    const currentUser = this.authService.getCurrentUser();
    console.log('Checking edit permission:', {
      currentUserId: currentUser?.id,
      authorId: this.bug.author.id,
      canEdit: currentUser?.id === this.bug.author.id
    });
    return currentUser?.id === this.bug.author.id;
  }

  canDeleteBug(): boolean {
    if (!this.bug || !this.bug.author) {
      console.log('Cannot delete: No bug or author');
      return false;
    }
    const currentUser = this.authService.getCurrentUser();
    const isAuthor = currentUser?.id === this.bug.author.id;
    const isModerator = this.authService.isModerator();
    console.log('Checking delete permission:', {
      currentUserId: currentUser?.id,
      authorId: this.bug.author.id,
      isAuthor,
      isModerator,
      canDelete: isAuthor || isModerator
    });
    return isAuthor || isModerator;
  }

  onDeleteBug(): void {
    if (!this.bug?.id) {
      this.snackBar.open('Cannot delete bug: Invalid bug ID', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Bug Report',
        message: 'Are you sure you want to delete this bug report? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.bug?.id) {
        this.loading = true;
        this.bugsService.deleteBug(this.bug.id as number).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Bug report deleted successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/bugs']);
          },
          error: (error) => {
            this.loading = false;
            console.error('Error deleting bug:', error);
            if (error.status === 404) {
              this.snackBar.open('Bug not found', 'Close', { duration: 3000 });
            } else {
              this.snackBar.open('Failed to delete bug report', 'Close', { duration: 3000 });
            }
          }
        });
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'solved':
        return 'primary';
      case 'not solved':
        return 'warn';
      default:
        return 'primary';
    }
  }
} 