import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Bug } from '../models/bug.model';

@Injectable({
  providedIn: 'root'
})
export class BugService {
  private apiUrl = `${environment.apiUrl}/bugs`;

  constructor(private http: HttpClient) { }

  getBugs(): Observable<Bug[]> {
    return this.http.get<Bug[]>(this.apiUrl);
  }

  getBug(id: number): Observable<Bug> {
    return this.http.get<Bug>(`${this.apiUrl}/${id}`);
  }

  createBug(bug: Partial<Bug>): Observable<Bug> {
    return this.http.post<Bug>(this.apiUrl, bug);
  }

  updateBug(id: number, bug: Partial<Bug>): Observable<Bug> {
    return this.http.put<Bug>(`${this.apiUrl}/${id}`, bug);
  }

  deleteBug(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateBugStatus(id: number, status: Bug['status']): Observable<Bug> {
    return this.http.patch<Bug>(`${this.apiUrl}/${id}/status`, { status });
  }

  updateBugPriority(id: number, priority: Bug['priority']): Observable<Bug> {
    return this.http.patch<Bug>(`${this.apiUrl}/${id}/priority`, { priority });
  }

  assignBug(id: number, assigneeId: number): Observable<Bug> {
    return this.http.patch<Bug>(`${this.apiUrl}/${id}/assign`, { assigneeId });
  }

  addTag(id: number, tag: string): Observable<Bug> {
    return this.http.post<Bug>(`${this.apiUrl}/${id}/tags`, { tag });
  }

  removeTag(id: number, tag: string): Observable<Bug> {
    return this.http.delete<Bug>(`${this.apiUrl}/${id}/tags/${tag}`);
  }

  upvoteBug(id: number): Observable<Bug> {
    return this.http.post<Bug>(`${this.apiUrl}/${id}/upvote`, {});
  }

  downvoteBug(id: number): Observable<Bug> {
    return this.http.post<Bug>(`${this.apiUrl}/${id}/downvote`, {});
  }
}
