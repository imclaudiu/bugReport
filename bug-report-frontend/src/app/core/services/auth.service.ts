import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
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
                    localStorage.setItem(this.TOKEN_KEY, username);
                    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
                    return user;
                })
            );
    }

    register(user: Partial<User>): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/users/register`, user)
            .pipe(
                tap(response => {
                    localStorage.setItem(this.TOKEN_KEY, response.username);
                    localStorage.setItem(this.USER_KEY, JSON.stringify(response));
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
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    isModerator(): boolean {
        const user = this.getCurrentUser();
        return user?.isModerator || false;
    }

    isBanned(): boolean {
        const user = this.getCurrentUser();
        return user?.isBanned || false;
    }
} 