import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>User Profile</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="profile-info" *ngIf="!isLoading">
            <div class="avatar-section">
              <mat-icon class="avatar-icon">account_circle</mat-icon>
            </div>
            <div class="details-section">
              <mat-list>
                <mat-list-item>
                  <span matListItemTitle>Username</span>
                  <span matListItemLine>{{ user?.username || 'Not available' }}</span>
                </mat-list-item>
                <mat-divider></mat-divider>
                <mat-list-item>
                  <span matListItemTitle>Email</span>
                  <span matListItemLine>{{ user?.email || 'Not available' }}</span>
                </mat-list-item>
                <mat-divider></mat-divider>
                <mat-list-item>
                  <span matListItemTitle>Phone</span>
                  <span matListItemLine>{{ user?.phone || 'Not provided' }}</span>
                </mat-list-item>
                <mat-divider></mat-divider>
                <mat-list-item>
                  <span matListItemTitle>User Score</span>
                  <span matListItemLine>{{ user?.score || 0 }}</span>
                </mat-list-item>
                <mat-divider></mat-divider>
                <mat-list-item>
                  <span matListItemTitle>Role</span>
                  <span matListItemLine>{{ user?.isModerator ? 'Moderator' : 'User' }}</span>
                </mat-list-item>
                <mat-divider></mat-divider>
                <mat-list-item>
                  <span matListItemTitle>Status</span>
                  <span matListItemLine>{{ user?.isBanned ? 'Banned' : 'Active' }}</span>
                </mat-list-item>
              </mat-list>
            </div>
          </div>
          <div class="loading-container" *ngIf="isLoading">
            <mat-spinner></mat-spinner>
          </div>
          <div class="error-container" *ngIf="error">
            <p class="error-message">{{ error }}</p>
            <button mat-button color="primary" (click)="loadUserProfile()">Retry</button>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary" routerLink="/users/settings">
            <mat-icon>settings</mat-icon>
            Edit Profile
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-info {
      display: flex;
      gap: 24px;
      padding: 16px;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-icon {
      font-size: 100px;
      height: 100px;
      width: 100px;
    }

    .details-section {
      flex: 1;
    }

    mat-list {
      padding: 0;
    }

    mat-list-item {
      height: auto !important;
      padding: 8px 0;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
    }

    mat-card-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 32px;
    }

    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px;
    }

    .error-message {
      color: #f44336;
      text-align: center;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.error = null;
    
    // First try to get the user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.user = {
          ...user,
          isModerator: user.moderator || false,
          isBanned: user.banned || false
        };
        this.isLoading = false;
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    // Then try to get fresh data from the server
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
        this.error = 'Failed to load user profile. Please try again.';
        this.isLoading = false;
        // If unauthorized, redirect to login
        if (error.status === 401) {
          this.authService.logout();
        }
      }
    });
  }
} 