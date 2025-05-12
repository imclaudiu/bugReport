import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../services/auth.service';
import { Subscription, filter } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="toolbar">
        <div class="toolbar-content">
          <div class="left-section">
            <a routerLink="/bugs" class="logo">Bug Report</a>
          </div>
          <div class="right-section">
            <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="User menu">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #menu="matMenu" class="user-menu">
              <button mat-menu-item routerLink="/users/profile">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item routerLink="/users/settings">
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>exit_to_app</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </mat-toolbar>
      <main class="main-content">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .left-section {
      display: flex;
      align-items: center;
    }

    .logo {
      color: black;
      text-decoration: none;
      font-size: 1.2rem;
      font-weight: 500;
      display: flex;
      align-items: center;
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .main-content {
      margin-top: 64px;
      padding: 24px;
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    @media (max-width: 600px) {
      .main-content {
        padding: 16px;
      }
    }

    mat-icon {
      color: black;
    }

    .user-menu {
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .user-menu button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-menu mat-icon {
      margin-right: 8px;
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  private authSubscription: Subscription = new Subscription();
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private overlayContainer: OverlayContainer
  ) {}

  ngOnInit() {
    // Subscribe to auth state changes
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.router.navigate(['/auth/login']);
      }
    });

    // Subscribe to router events
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Force change detection after navigation
      setTimeout(() => {
        this.cdr.detectChanges();
      });
    });
  }

  ngAfterViewInit() {
    // Ensure overlay container is properly initialized
    this.overlayContainer.getContainerElement().classList.add('cdk-overlay-container');
    // Force change detection after view initialization
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 