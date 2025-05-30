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
import { BugService } from '../../services/bug.service';
import { Bug } from '../../models/bug.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommentListComponent } from '../comment-list/comment-list.component';

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
    MatDialogModule,
    CommentListComponent
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
    private bugService: BugService,
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
      canEdit: currentUser?.id === this.bug.author.id || currentUser?.moderator
    });
    return currentUser?.id === this.bug.author.id || this.authService.isModerator();
  }

  isModerator(): boolean {
    return this.authService.isModerator();
  }

  banUser(userId: number): void {
    if (confirm('Are you sure you want to ban this user?')) {
      this.authService.banUser(userId).subscribe({
        next: () => {
          this.snackBar.open('User banned successfully', 'Close', { duration: 3000 });
          if (this.bug && this.bug.author && this.bug.author.id === userId) {
            this.bug.author.banned = true;
          }
        },
        error: () => {
          this.snackBar.open('Failed to ban user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  upvote(bug: Bug): void {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('You must be logged in to vote.', 'Close', { duration: 2000 });
      return;
    }
    this.bugsService.upvoteBug(bug.id!).subscribe({
      next: (updatedBug) => {
        bug.voteCount = updatedBug.voteCount;
      },
      error: () => {
        this.snackBar.open('Failed to upvote', 'Close', { duration: 2000 });
      }
    });
  }

  downvote(bug: Bug): void {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('You must be logged in to vote.', 'Close', { duration: 2000 });
      return;
    }
    this.bugsService.downvoteBug(bug.id!).subscribe({
      next: (updatedBug) => {
        bug.voteCount = updatedBug.voteCount;
      },
      error: () => {
        this.snackBar.open('Failed to downvote', 'Close', { duration: 2000 });
      }
    });
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

    if (confirm('Are you sure you want to delete this bug?')) {
      this.bugsService.deleteBug(this.bug.id).subscribe({
        next: () => {
          this.snackBar.open('Bug deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/bugs']);
        },
        error: (err) => {
          console.error('Error deleting bug:', err);
          this.snackBar.open('Failed to delete bug. Please try again.', 'Close', { duration: 5000 });
        }
      });
    }
  }

  onReply(): void {
    // Scroll to the comment section
    const commentSection = document.querySelector('.comments-section');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'RECEIVED':
        return 'warn';
      case 'IN PROGRESS':
        return 'accent';
      case 'SOLVED':
        return 'primary';
      default:
        return 'default';
    }
  }

  unbanUser(id: number) {
    if (confirm('Are you sure you want to unban this user?')) {
      this.authService.unbanUser(id).subscribe({
        next: () => {
          this.snackBar.open('User unbanned successfully', 'Close', { duration: 3000 });
          if (this.bug && this.bug.author && this.bug.author.id === id) {
            this.bug.author.banned = false;
          }
        },
        error: () => {
          this.snackBar.open('Failed to unban user', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
