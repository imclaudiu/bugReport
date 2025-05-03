import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" placeholder="Enter username">
        <mat-error *ngIf="userForm.get('username')?.hasError('required')">
          Username is required
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" placeholder="Enter email">
        <mat-error *ngIf="userForm.get('email')?.hasError('required')">
          Email is required
        </mat-error>
        <mat-error *ngIf="userForm.get('email')?.hasError('email')">
          Please enter a valid email
        </mat-error>
      </mat-form-field>

      <div class="flex justify-end gap-2">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">
          {{ isEditMode ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  `
})
export class UserFormComponent {
  @Input() user?: User;
  @Output() submitForm = new EventEmitter<Partial<User>>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    if (this.user) {
      this.isEditMode = true;
      this.userForm.patchValue({
        username: this.user.username,
        email: this.user.email
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.submitForm.emit(this.userForm.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
} 