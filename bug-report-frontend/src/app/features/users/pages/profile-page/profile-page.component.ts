import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile-page',
  template: `
    <div class="profile-container">
      <div *ngIf="isLoading" class="loading">
        <mat-spinner></mat-spinner>
      </div>
      <div *ngIf="!isLoading && currentUser">
        <h2>Profile</h2>
        <div class="user-info">
          <p><strong>Username:</strong> {{ currentUser.username }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>
          <p><strong>Role:</strong> {{ currentUser.role }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .user-info {
      margin-top: 20px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule
  ]
})
export class ProfilePageComponent {
  currentUser: any = null;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loadUser();
  }

  private loadUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
    }
    this.isLoading = false;
  }
} 