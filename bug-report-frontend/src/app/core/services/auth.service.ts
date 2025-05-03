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
    private readonly USER_KEY = 'user';
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
            this.currentUserSubject.next(JSON.parse(storedUser));
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
                map(response => ({
                    ...response.user,
                    isModerator: response.user.moderator,
                    isBanned: response.user.banned
                }))
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
        return user?.isModerator || false;
    }

    isBanned(): boolean {
        const user = this.getCurrentUser();
        return user?.isBanned || false;
    }

    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;

        switch(role) {
            case 'admin':
                return user.isModerator;
            case 'user':
                return !user.isBanned;
            default:
                return false;
        }
    }

    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    public setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    private handleAuthentication(response: { token: string, user: any, expiresIn: number }): void {
        const expirationDate = new Date(new Date().getTime() + response.expiresIn * 1000);
        this.setToken(response.token);
        localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expirationDate.toISOString());
        this.setUser(response.user);
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
        this.http.get<any>(`${this.baseUrl}/users/getUserByUsername/${username}`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        })
            .pipe(
                map(response => ({
                    ...response,
                    isModerator: response.moderator,
                    isBanned: response.banned
                })),
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
} 