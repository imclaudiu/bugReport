import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseService {
    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY = 'user';

    constructor(http: HttpClient) {
        super(http);
    }

    login(username: string, password: string): Observable<User> {
        return this.http.get<boolean>(`${this.baseUrl}/users/checkPass/${username}/${password}`)
            .pipe(
                map(isValid => {
                    if (!isValid) {
                        throw new Error('Invalid credentials');
                    }
                    // Since backend doesn't return token, we'll use username as temporary token
                    const user: User = {
                        username,
                        email: '', // Will be filled after getting user details
                        isModerator: false,
                        isBanned: false
                    };
                    this.setToken(username);
                    this.setUser(user);
                    return user;
                }),
                tap(() => this.loadUserDetails(username))
            );
    }

    register(user: Partial<User>): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/users/register`, user)
            .pipe(
                tap(response => {
                    this.setToken(response.username);
                    this.setUser(response);
                })
            );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
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

    private setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private loadUserDetails(username: string): void {
        this.http.get<User>(`${this.baseUrl}/users/${username}`)
            .pipe(
                tap(user => this.setUser(user)),
                map(() => null)
            )
            .subscribe({
                error: (error) => {
                    console.error('Failed to load user details:', error);
                    this.logout();
                }
            });
    }
} 