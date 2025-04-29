import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LayoutComponent],
  template: `
    <app-layout *ngIf="isLoggedIn">
      <router-outlet></router-outlet>
    </app-layout>
    <router-outlet *ngIf="!isLoggedIn"></router-outlet>
  `
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Check initial auth state
    this.isLoggedIn = this.authService.isAuthenticated();
    
    // Subscribe to auth state changes
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        console.log('Auth state changed:', isAuthenticated);
        this.isLoggedIn = isAuthenticated;
      }
    );
  }
}