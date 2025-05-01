import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User, UserSettings, UserSession, UserActivity } from '../models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Profile Management
  getCurrentUser(): Observable<User> {
    const username = this.authService.getCurrentUser()?.username;
    if (!username) {
      throw new Error('No user is currently logged in');
    }
    return this.http.get<User>(`${this.apiUrl}/getUserByUsername/${username}`, { headers: this.getHeaders() });
  }

  updateProfile(data: Partial<User>): Observable<User> {
    const username = this.authService.getCurrentUser()?.username;
    if (!username) {
      throw new Error('No user is currently logged in');
    }
    return this.http.put<User>(`${this.apiUrl}/updateUser/${username}`, data, { headers: this.getHeaders() });
  }

  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ avatarUrl: string }>(`${this.apiUrl}/me/avatar`, formData, { headers: this.getHeaders() });
  }

  // Settings Management
  getUserSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.apiUrl}/me/settings`, { headers: this.getHeaders() });
  }

  updateSettings(settings: Partial<UserSettings>): Observable<UserSettings> {
    return this.http.put<UserSettings>(`${this.apiUrl}/me/settings`, settings, { headers: this.getHeaders() });
  }

  // Security
  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/me/password`, {
      oldPassword,
      newPassword
    }, { headers: this.getHeaders() });
  }

  enableTwoFactor(): Observable<{ secret: string }> {
    return this.http.post<{ secret: string }>(`${this.apiUrl}/me/2fa/enable`, {}, { headers: this.getHeaders() });
  }

  verifyTwoFactor(code: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/me/2fa/verify`, { code });
  }

  disableTwoFactor(code: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/me/2fa/disable`, { code }, { headers: this.getHeaders() });
  }

  // Sessions
  getActiveSessions(): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.apiUrl}/me/sessions`, { headers: this.getHeaders() });
  }

  revokeSession(sessionId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/me/sessions/${sessionId}/revoke`, {}, { headers: this.getHeaders() });
  }

  // Activity
  getUserActivity(): Observable<UserActivity[]> {
    return this.http.get<UserActivity[]>(`${this.apiUrl}/me/activity`, { headers: this.getHeaders() });
  }
} 