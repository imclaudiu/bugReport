import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  @Input() bugId!: number;
  comments: Comment[] = [];
  loading = false;
  error: string | null = null;

  constructor(private commentsService: CommentsService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.loading = true;
    this.error = null;
    this.commentsService.getAllComments(this.bugId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load comments. Please try again later.';
        this.loading = false;
        console.error('Error loading comments:', err);
      }
    });
  }

  onCommentAdded(comment: Comment): void {
    this.comments = [comment, ...this.comments];
  }

  onCommentDeleted(commentId: number): void {
    this.comments = this.comments.filter(comment => comment.id !== commentId);
  }
}
