import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CommentFormComponent implements OnInit {
  @Input() bugId!: number;
  @Input() comment?: Comment;
  @Output() commentSaved = new EventEmitter<Comment>();
  @Output() cancel = new EventEmitter<void>();

  commentForm: FormGroup;
  loading = false;
  error: string | null = null;
  @Input() parentId!: number;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService
  ) {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(1)]],
      imageURL: ['']

    });
  }

  ngOnInit(): void {
    if (this.comment) {
      this.commentForm.patchValue({
        text: this.comment.text
      });
    }
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const text = this.commentForm.get('text')?.value;
    const imageURL = this.commentForm.get('imageURL')?.value;

    if (this.comment) {
      // Edit existing comment
      this.commentService.updateComment(this.comment.id, this.bugId, text, imageURL).subscribe({
        next: (updatedComment) => {
          this.commentSaved.emit(updatedComment);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to update comment';
          this.loading = false;
        }
      });
    } else {
      // Create new comment
      this.commentService.createComment(this.bugId, text, imageURL).subscribe({
        next: (newComment) => {
          this.commentSaved.emit(newComment);
          this.commentForm.reset();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to create comment';
          this.loading = false;
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.commentForm.get('imageURL')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
