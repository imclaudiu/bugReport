import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/user.service';
import { UserSettings } from '../../../models/user.model';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class NotificationSettingsComponent implements OnInit {
  notificationForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      pushNotifications: [true],
      bugUpdates: [true],
      commentNotifications: [true],
      statusChanges: [true],
      weeklyDigest: [false]
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.userService.getUserSettings().subscribe({
      next: (settings: UserSettings) => {
        this.notificationForm.patchValue({
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading notification settings:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.notificationForm.valid) {
      this.isLoading = true;
      this.userService.updateSettings(this.notificationForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          // Show success message
        },
        error: (error) => {
          console.error('Error updating notification settings:', error);
          this.isLoading = false;
        }
      });
    }
  }
} 