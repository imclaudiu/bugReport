import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseService {
    protected baseUrl = 'http://localhost:8080/api'; // Update this with your backend URL

    constructor(protected http: HttpClient) {}

    protected getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    protected get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${endpoint}`, { headers: this.getHeaders() });
    }

    protected post<T>(endpoint: string, data: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { headers: this.getHeaders() });
    }

    protected put<T>(endpoint: string, data: any): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, { headers: this.getHeaders() });
    }

    protected delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { headers: this.getHeaders() });
    }
} 