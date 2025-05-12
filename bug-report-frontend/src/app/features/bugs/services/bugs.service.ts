import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Bug } from '../models/bug.model';

@Injectable({
  providedIn: 'root'
})
export class BugsService {
  private apiUrl = `${environment.apiUrl}/bug`;

  constructor(private http: HttpClient) { }

  getAllBugs(): Observable<Bug[]> {
    return this.http.get<Bug[]>(`${this.apiUrl}/getAllBugs`);
  }

  getBugById(id: number): Observable<Bug> {
    return this.http.get<Bug>(`${this.apiUrl}/getBug/${id}`);
  }

  createBug(bug: Partial<Bug>): Observable<Bug> {
    return this.http.post<Bug>(`${this.apiUrl}/addBug`, bug);
  }

  updateBug(id: number, bug: Partial<Bug>): Observable<Bug> {
    return this.http.put<Bug>(`${this.apiUrl}/updateBug/${id}`, bug);
  }

  deleteBug(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteBug/${id}`, { responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error deleting bug:', error);
          return throwError(() => error);
        })
      );
  }
} 