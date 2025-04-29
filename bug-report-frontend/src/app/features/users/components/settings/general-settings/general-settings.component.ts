import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/user.service';
import { UserSettings } from '../../../models/user.model';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class GeneralSettingsComponent implements OnInit {
  generalForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.generalForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      language: ['en'],
      theme: ['light']
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.userService.getUserSettings().subscribe({
      next: (settings: UserSettings) => {
        this.generalForm.patchValue({
          displayName: settings.displayName,
          email: settings.email,
          language: settings.language,
          theme: settings.theme
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.generalForm.valid) {
      this.isLoading = true;
      this.userService.updateSettings(this.generalForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          // Show success message
        },
        error: (error) => {
          console.error('Error updating settings:', error);
          this.isLoading = false;
        }
      });
    }
  }
} 