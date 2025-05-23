import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="settings-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Edit Profile</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-error *ngIf="settingsForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone" placeholder="+40 123 456 789">
              <mat-error *ngIf="settingsForm.get('phone')?.hasError('pattern')">
                Please enter a valid phone number
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Current Password</mat-label>
              <input matInput formControlName="currentPassword" type="password">
              <mat-error *ngIf="settingsForm.get('currentPassword')?.hasError('required')">
                Current password is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New Password</mat-label>
              <input matInput formControlName="newPassword" type="password">
              <mat-error *ngIf="settingsForm.get('newPassword')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm New Password</mat-label>
              <input matInput formControlName="confirmPassword" type="password">
              <mat-error *ngIf="settingsForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <div class="button-container">
              <button mat-button type="button" (click)="onCancel()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="settingsForm.invalid || isLoading">
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <span *ngIf="!isLoading">Save Changes</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }

    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  user: User | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.settingsForm = this.fb.group({
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s-()]+$/)]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.user = currentUser;
    this.initializeForm();
  }

  initializeForm() {
    if (this.user) {
      this.settingsForm.patchValue({
        email: this.user.email,
        phone: this.user.phone
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onCancel() {
    this.router.navigate(['/users/profile']);
  }

  async onSubmit() {
    if (this.settingsForm.invalid) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.snackBar.open('No user is currently logged in', 'Close', { duration: 3000 });
      this.router.navigate(['/auth/login']);
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Changes',
        message: 'Are you sure you want to update your profile?'
      }
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (!result) return;

    this.isLoading = true;
    try {
      const formValue = this.settingsForm.value;
      const updatedUser: Partial<User> = {
        email: formValue.email,
        phone: formValue.phone
      };

      // Only include password if it's being changed
      if (formValue.newPassword && formValue.newPassword.length >= 6) {
        updatedUser.password = formValue.newPassword;
      }

      // Update user using the service
      await firstValueFrom(
        this.userService.updateUser(currentUser.id.toString(), updatedUser)
      );
      
      this.snackBar.open('Profile updated successfully', 'Close', {
        duration: 3000
      });
      
      // Navigate back to profile
      this.router.navigate(['/users/profile']);
    } catch (error) {
      console.error('Error updating profile:', error);
      this.snackBar.open('Failed to update profile', 'Close', {
        duration: 3000
      });
    } finally {
      this.isLoading = false;
    }
  }
} 