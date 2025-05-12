import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User, UserActivity } from '../../../models/user.model';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class ProfileDetailsComponent implements OnInit {
  user: User | null = null;
  activities: UserActivity[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserActivity();
  }

  loadUserProfile(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.user = user;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load user profile';
        this.loading = false;
      }
    });
  }

  loadUserActivity(): void {
    this.userService.getUserActivity().subscribe({
      next: (activities: UserActivity[]) => {
        this.activities = activities;
      },
      error: (err: any) => {
        console.error('Failed to load user activity:', err);
      }
    });
  }

  onEditProfile(): void {
    this.router.navigate(['/users/profile/edit']);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'BUG_CREATED':
        return 'bug_report';
      case 'BUG_UPDATED':
        return 'edit';
      case 'COMMENT_ADDED':
        return 'comment';
      default:
        return 'info';
    }
  }
} 