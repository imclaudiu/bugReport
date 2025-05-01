import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { MatCardContent, MatCardHeader, MatCardTitle, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink, 
    MatCardModule, 
    MatButtonModule, 
    AuthFormComponent,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardActions
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-auth-form
            [isRegister]="false"
            (submitForm)="onLogin($event)"
          ></app-auth-form>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button color="primary" routerLink="/auth/register">
            Don't have an account? Register
          </a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
    }
    mat-card {
      width: 100%;
      max-width: 400px;
      margin: 1rem;
    }
    mat-card-header {
      justify-content: center;
      margin-bottom: 1rem;
    }
    mat-card-actions {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }
  `]
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(userData: { username: string; password: string }) {
    this.authService.login(userData.username, userData.password)
      .subscribe({
        next: (user) => {
          if (user) {
            // Redirect to home page after successful login
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Here you could add error handling (show error message)
        }
      });
  }
} 