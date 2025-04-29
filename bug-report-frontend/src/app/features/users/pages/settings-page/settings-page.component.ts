import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ]
})
export class SettingsPageComponent {
  settingsLinks = [
    { path: 'general', icon: 'settings', label: 'General Settings' },
    { path: 'notifications', icon: 'notifications', label: 'Notifications' },
    { path: 'security', icon: 'security', label: 'Security' }
  ];
} 