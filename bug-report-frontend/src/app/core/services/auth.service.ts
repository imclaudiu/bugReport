import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, throwError, BehaviorSubject, of } from 'rxjs';
import { User } from '../models/user.model';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseService {
    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY = 'currentUser';
    private readonly TOKEN_EXPIRATION_KEY = 'tokenExpiration';
    private authState = new BehaviorSubject<boolean>(false);
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    private tokenExpirationTimer: any;

    constructor(http: HttpClient) {
        super(http);
        // Initialize auth state from localStorage
        this.authState.next(this.isAuthenticated());
        const storedUser = localStorage.getItem(this.USER_KEY);
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                // Map the fields correctly
                this.currentUserSubject.next({
                    ...user,
                    phone: user.phoneNumber || null,
                    moderator: user.moderator || false,
                    banned: user.banned || false
                });
            } catch (e) {
                console.error('Failed to parse stored user:', e);
            }
        }
    }

    get isAuthenticated$(): Observable<boolean> {
        return this.authState.asObservable();
    }

    login(username: string, password: string): Observable<User> {
        return this.http.post<{ token: string, user: any, expiresIn: number }>(`${this.baseUrl}/auth/login`, { username, password })
            .pipe(
                tap(response => {
                    this.handleAuthentication(response);
                }),
                map(response => {
                    const user = {
                        ...response.user,
                        moderator: response.user.moderator || false,
                        banned: response.user.banned || false,
                        phone: response.user.phoneNumber || response.user.phone || null
                    };
                    this.setUser(user);
                    return user;
                })
            );
    }

    register(user: Partial<User>): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/users/register`, user)
            .pipe(
                tap(response => {
                    this.setToken(response.username);
                    this.setUser(response);
                    this.authState.next(true);
                })
            );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
        this.authState.next(false);
        this.currentUserSubject.next(null);
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    getToken(): string | null {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const expirationDate = localStorage.getItem(this.TOKEN_EXPIRATION_KEY);
        if (!token || !expirationDate) {
            return null;
        }
        if (new Date(expirationDate) <= new Date()) {
            this.logout();
            return null;
        }
        return token;
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    isModerator(): boolean {
        const user = this.getCurrentUser();
        return user?.moderator || false;
    }

    isBanned(): boolean {
        const user = this.getCurrentUser();
        return user?.banned || false;
    }

    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;

        switch(role) {
            case 'admin':
                return user.moderator;
            case 'user':
                return !user.banned;
            default:
                return false;
        }
    }

    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    public setUser(user: User): void {
        // Map the fields correctly
        const userToStore = {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phoneNumber || user.phone || null,
            moderator: user.moderator || false,
            banned: user.banned || false,
            score: user.score || 0
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(userToStore));
        this.currentUserSubject.next(userToStore);
    }

    private handleAuthentication(response: { token: string, user: any, expiresIn: number }): void {
        const expirationDate = new Date(new Date().getTime() + response.expiresIn * 1000);
        this.setToken(response.token);
        localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expirationDate.toISOString());

        // Store the user data with proper field mapping
        const userData = {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
            phone: response.user.phoneNumber || response.user.phone || null,
            moderator: response.user.moderator || false,
            banned: response.user.banned || false,
            score: response.user.score || 0
        };
        this.setUser(userData);
        this.authState.next(true);
        this.autoLogout(response.expiresIn * 1000);
    }

    private autoLogout(expirationDuration: number): void {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private loadUserDetails(username: string): void {
        this.http.get<User>(`${this.baseUrl}/users/getUserByUsername/${username}`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        })
            .pipe(
                tap(user => {
                    this.setUser(user);
                    this.authState.next(true);
                })
            )
            .subscribe({
                error: (error) => {
                    console.error('Failed to load user details:', error);
                    this.logout();
                }
            });
    }

  banUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/banUser/${userId}`, {}, { headers: this.getHeaders() });
  }

  unbanUser(id: number) {
    return this.http.put<void>(`${this.baseUrl}/users/unbanUser/${id}`, {}, { headers: this.getHeaders() });
  }
}
