import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthService } from './core/services/auth.service';
import { Subscription, filter } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

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
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoggedIn = false;
  private authSubscription: Subscription = new Subscription();
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private overlayContainer: OverlayContainer
  ) {}

  ngOnInit() {
    // Set initial auth state
    this.isLoggedIn = this.authService.isAuthenticated();
    
    // Subscribe to auth state changes
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
      }
    );

    // Subscribe to router events
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Force change detection after navigation
      setTimeout(() => {
        this.isLoggedIn = this.authService.isAuthenticated();
      });
    });
  }

  ngAfterViewInit() {
    // Ensure overlay container is properly initialized
    this.overlayContainer.getContainerElement().classList.add('cdk-overlay-container');
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}