import { Component, Input, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    CommentFormComponent,
    NgOptimizedImage
  ]
})
export class CommentListComponent implements OnInit {
  @Input() bugId!: number;
  comments: Comment[] = [];
  loading = true;
  error: string | null = null;
  editingComment: Comment | null = null;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.loading = true;
    this.error = null;
    this.commentService.getCommentsForBug(this.bugId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load comments';
        this.loading = false;
        this.snackBar.open('Failed to load comments', 'Close', { duration: 3000 });
      }
    });
  }

  canEdit(comment: Comment): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === comment.author.id;
  }

  canDelete(comment: Comment): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === comment.author.id || (currentUser?.moderator ?? false);
  }

  editComment(comment: Comment): void {
    this.editingComment = comment;
  }

  deleteComment(comment: Comment): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(comment.id).subscribe({
        next: (response) => {
          // Check if the response status is in the 2xx range
          if (response.status >= 200 && response.status < 300) {
            this.comments = this.comments.filter(c => c.id !== comment.id);
            this.snackBar.open('Comment deleted successfully', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Failed to delete comment', 'Close', { duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
          // Only show error if the status is not 200 (success)
          if (err.status !== 200) {
            this.snackBar.open('Failed to delete comment', 'Close', { duration: 3000 });
          } else {
            // If status is 200, treat it as success
            this.comments = this.comments.filter(c => c.id !== comment.id);
            this.snackBar.open('Comment deleted successfully', 'Close', { duration: 3000 });
          }
        }
      });
    }
  }

  onCommentSaved(updatedComment: Comment): void {
    if (this.editingComment) {
      const index = this.comments.findIndex(c => c.id === updatedComment.id);
      if (index !== -1) {
        this.comments[index] = updatedComment;
      }
      this.editingComment = null;
      this.snackBar.open('Comment updated successfully', 'Close', { duration: 3000 });
    } else {
      this.comments.unshift(updatedComment);
      this.snackBar.open('Comment added successfully', 'Close', { duration: 3000 });
    }
  }

  onCancelEdit(): void {
    this.editingComment = null;
  }
}
