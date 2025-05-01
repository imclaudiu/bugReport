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
    RouterModule
  ],
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>User Profile</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="profile-info">
            <div class="avatar-section">
              <mat-icon class="avatar-icon">account_circle</mat-icon>
            </div>
            <div class="details-section">
              <mat-list>
                <mat-list-item>
                  <span matListItemTitle>Username</span>
                  <span matListItemLine>{{ user?.username || 'Loading...' }}</span>
                </mat-list-item>
                <mat-divider></mat-divider>
                <mat-list-item>
                  <span matListItemTitle>Email</span>
                  <span matListItemLine>{{ user?.email || 'Loading...' }}</span>
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
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    console.log('ProfileComponent constructor');
    console.log('Current token:', this.authService.getToken());
  }

  ngOnInit() {
    console.log('ProfileComponent ngOnInit');
    console.log('Making API call to /users/me');
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('User data received:', user);
        this.user = user;
      },
      error: (error) => {
        console.error('Failed to load user details:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error response:', error.error);
      }
    });
  }
} 