import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { Comment, CommentCreateDto } from '../../models/comment.model';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent {
  @Input() bugId!: number;
  @Output() commentAdded = new EventEmitter<Comment>();

  commentForm: FormGroup;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      this.submitting = true;
      this.error = null;

      const comment: CommentCreateDto = {
        bugId: this.bugId,
        content: this.commentForm.value.content
      };

      this.commentsService.createComment(comment).subscribe({
        next: (newComment) => {
          this.commentAdded.emit(newComment);
          this.commentForm.reset();
          this.submitting = false;
        },
        error: (err) => {
          this.error = 'Failed to add comment. Please try again.';
          this.submitting = false;
          console.error('Error creating comment:', err);
        }
      });
    }
  }
}
