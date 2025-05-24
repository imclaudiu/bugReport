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
    return this.http.get<Bug[]>(`${this.apiUrl}/sortByDate`);
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

  // Filter bugs by title
  searchBugsByTitle(title: string): Observable<Bug[]> {
    return this.http.get<Bug[]>(`${this.apiUrl}/search/title`, { params: { title } });
  }

  // Filter bugs by user
  getBugsByUser(userId: number): Observable<Bug[]> {
    return this.http.get<Bug[]>(`${this.apiUrl}/search/user/${userId}`);
  }

  // Filter bugs by tag
  getBugsByTag(tagName: string): Observable<Bug[]> {
    return this.http.get<Bug[]>(`${this.apiUrl}/search/tag/${tagName}`);
  }

  // Filter bugs by multiple criteria
  filterBugs(title?: string, userId?: number, tagName?: string): Observable<Bug[]> {
    const params: any = {};
    if (title) params.title = title;
    if (userId) params.userId = userId;
    if (tagName) params.tagName = tagName;
    
    return this.http.get<Bug[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error filtering bugs:', error);
        return throwError(() => error);
      })
    );
  }
} 