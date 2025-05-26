import { Component, Input, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CommentFormComponent } from '../comment-form/comment-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// @ts-ignore
import {MatIcon} from '@angular/material/icon-module.d-BeibE7j0';

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
    MatIconModule
  ]
})
export class CommentListComponent implements OnInit {
  @Input() bugId!: number;
  comments: Comment[] = [];
  loading = true;
  error: string | null = null;
  editingComment: Comment | null = null;
  replyingToCommentId: number | null = null;

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
        // Convert dates to Date objects
        const processedComments = comments.map(comment => ({
          ...comment,
          date: new Date(comment.date)
        }));

        // Separate parent comments and replies
        const parentComments = processedComments.filter(comment => !comment.parent);
        const replies = processedComments.filter(comment => comment.parent);

        // Organize replies under their parent comments
        this.comments = parentComments.map(parent => ({
          ...parent,
          replies: replies
            .filter(reply => reply.parent?.id === parent.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.error = 'Failed to load comments';
        this.loading = false;
        this.snackBar.open('Failed to load comments', 'Close', { duration: 3000 });
      }
    });
  }

  canEdit(comment: Comment): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === comment.author.id || (currentUser?.moderator ?? false);
  }

  canDelete(comment: Comment): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === comment.author.id || (currentUser?.moderator ?? false);
  }

  editComment(comment: Comment): void {
    this.editingComment = comment;
  }

  showReplyForm(commentId: number): void {
    this.replyingToCommentId = commentId;
  }

  cancelReply(): void {
    this.replyingToCommentId = null;
  }

  onReplySaved(reply: Comment, parentComment: Comment): void {
    // Ensure replies array exists
    if (!parentComment.replies) {
      parentComment.replies = [];
    }

    // Add the new reply at the beginning of the replies array
    parentComment.replies.unshift({
      ...reply,
      date: new Date(reply.date),
      parent: parentComment
    });

    this.replyingToCommentId = null;
    this.snackBar.open('Reply added successfully', 'Close', { duration: 3000 });
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

  isModerator(): boolean {
    return this.authService.isModerator();
  }

  banUser(userId: number): void {
    if (confirm('Are you sure you want to ban this user?')) {
      this.authService.banUser(userId).subscribe({
        next: () => {
          this.snackBar.open('User banned successfully', 'Close', { duration: 3000 });
          this.loadComments(); // Refresh to show banned status
        },
        error: () => {
          this.snackBar.open('Failed to ban user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  unbanUser(userId: number): void {
    if (confirm('Are you sure you want to unban this user?')) {
      this.authService.unbanUser(userId).subscribe({
        next: () => {
          this.snackBar.open('User unbanned successfully', 'Close', { duration: 3000 });
          this.loadComments();
        },
        error: () => {
          this.snackBar.open('Failed to unban user', 'Close', { duration: 3000 });
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

  like(comment: Comment): void {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('You must be logged in to vote.', 'Close', { duration: 2000 });
      return;
    }
    this.commentService.likeComment(comment.id).subscribe({
      next: (updatedComment) => {
        if (updatedComment) {
          comment.voteCount = updatedComment.voteCount;
        } else {
          this.snackBar.open('Failed to update vote count', 'Close', { duration: 2000 });
        }
      },
      error: () => {
        this.snackBar.open('Failed to upvote', 'Close', { duration: 2000 });
      }
    });
  }

  dislike(comment: Comment): void {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('You must be logged in to vote.', 'Close', { duration: 2000 });
      return;
    }
    // @ts-ignore
    const userId = this.authService.getCurrentUser().id;
    console.log('Dislike voterId:', userId);
    // @ts-ignore
    this.commentService.dislikeComment(comment.id, userId).subscribe({
      next: (updatedComment) => {
        if (updatedComment) {
          comment.voteCount = updatedComment.voteCount;
        } else {
          this.snackBar.open('Failed to update vote count', 'Close', { duration: 2000 });
        }
      },
      error: () => {
        this.snackBar.open('Failed to downvote', 'Close', { duration: 2000 });
      }
    });
  }
}
