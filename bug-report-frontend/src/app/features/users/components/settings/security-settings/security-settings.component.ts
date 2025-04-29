import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="security-settings">
      <h2>Change Password</h2>
      <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Current Password</mat-label>
          <input matInput type="password" formControlName="currentPassword">
        </mat-form-field>

        <mat-form-field>
          <mat-label>New Password</mat-label>
          <input matInput type="password" formControlName="newPassword">
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="!passwordForm.valid">
          Change Password
        </button>
      </form>
    </div>
  `,
  styles: [`
    .security-settings {
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class SecuritySettingsComponent {
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.userService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          alert('Password changed successfully');
          this.passwordForm.reset();
        },
        error: (err) => {
          alert('Failed to change password');
          console.error(err);
        }
      });
    }
  }
} 