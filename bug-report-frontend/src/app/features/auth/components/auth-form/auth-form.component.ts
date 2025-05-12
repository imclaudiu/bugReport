import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="authForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" required>
        <mat-error *ngIf="authForm.get('username')?.hasError('required')">
          Username is required
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width" *ngIf="isRegister">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email" required>
        <mat-error *ngIf="authForm.get('email')?.hasError('required')">
          Email is required
        </mat-error>
        <mat-error *ngIf="authForm.get('email')?.hasError('email')">
          Please enter a valid email
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Password</mat-label>
        <input matInput formControlName="password" type="password" required>
        <mat-error *ngIf="authForm.get('password')?.hasError('required')">
          Password is required
        </mat-error>
        <mat-error *ngIf="authForm.get('password')?.hasError('minlength')">
          Password must be at least 6 characters
        </mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="authForm.invalid" class="full-width">
        {{ isRegister ? 'Register' : 'Login' }}
      </button>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
      padding: 1rem;
    }
  `]
})
export class AuthFormComponent implements OnChanges {
  @Input() isRegister = false;
  @Output() submitForm = new EventEmitter<{ username: string; email?: string; password: string }>();

  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (!this.isRegister) {
      this.authForm.get('email')?.clearValidators();
      this.authForm.get('email')?.updateValueAndValidity();
    }
  }

  ngOnChanges() {
    if (this.isRegister) {
      this.authForm.get('email')?.setValidators([Validators.required, Validators.email]);
    } else {
      this.authForm.get('email')?.clearValidators();
    }
    this.authForm.get('email')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.valid) {
      const formData = this.authForm.value;
      if (!this.isRegister) {
        delete formData.email;
      }
      this.submitForm.emit(formData);
    } else {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000
      });
    }
  }
} 