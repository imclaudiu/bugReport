import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, AuthFormComponent],
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Register</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-auth-form
            [isRegister]="true"
            (submitForm)="onRegister($event)"
          ></app-auth-form>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button color="primary" routerLink="/auth/login">
            Already have an account? Login
          </a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
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
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(userData: { username: string; email?: string; password: string }) {
    if (!userData.email) {
      console.error('Email is required for registration');
      return;
    }
    
    this.authService.register({
      username: userData.username,
      email: userData.email,
      password: userData.password
    }).subscribe({
      next: () => {
        // Redirect to login page after successful registration
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        // Here you could add error handling (show error message)
      }
    });
  }
} 