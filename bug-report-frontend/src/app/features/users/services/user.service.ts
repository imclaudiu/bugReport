import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User, UserSettings, UserSession, UserActivity } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  // Profile Management
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, data);
  }

  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ avatarUrl: string }>(`${this.apiUrl}/me/avatar`, formData);
  }

  // Settings Management
  getUserSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.apiUrl}/me/settings`);
  }

  updateSettings(settings: Partial<UserSettings>): Observable<UserSettings> {
    return this.http.put<UserSettings>(`${this.apiUrl}/me/settings`, settings);
  }

  // Security
  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/me/password`, {
      oldPassword,
      newPassword
    });
  }

  enableTwoFactor(): Observable<{ secret: string }> {
    return this.http.post<{ secret: string }>(`${this.apiUrl}/me/2fa/enable`, {});
  }

  verifyTwoFactor(code: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/me/2fa/verify`, { code });
  }

  disableTwoFactor(code: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/me/2fa/disable`, { code });
  }

  // Sessions
  getActiveSessions(): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.apiUrl}/me/sessions`);
  }

  revokeSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me/sessions/${sessionId}`);
  }

  // Activity
  getUserActivity(): Observable<UserActivity[]> {
    return this.http.get<UserActivity[]>(`${this.apiUrl}/me/activity`);
  }
} 