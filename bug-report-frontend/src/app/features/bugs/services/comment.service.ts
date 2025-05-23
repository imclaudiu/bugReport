import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comment } from '../models/comment.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comment`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getCommentsForBug(bugId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/getCommentsByBug/${bugId}`).pipe(
      catchError(error => {
        console.error('Error fetching comments:', error);
        return throwError(() => error);
      })
    );
  }

  getCommentById(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/getComment/${commentId}`);
  }

  createComment(bugId: number, text: string, imageURL: string, parentID?: number): Observable<Comment> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User must be logged in to comment'));
    }

    return this.http.post<Comment>(`${this.apiUrl}/addComment`, {
      text,
      imageURL,
      bug: { id: bugId },
      author: { id: currentUser.id },
      date: new Date().toISOString(),
      voteCount: 0,
      parentID
    });
  }

  updateComment(commentId: number, bugId: number, text: string, imageURL: string): Observable<Comment> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User must be logged in to update comment'));
    }

    return this.http.put<Comment>(`${this.apiUrl}/editComment/${commentId}`, {
      text,
      imageURL,
      date: new Date().toISOString(),
      author: { id: currentUser.id },
      bug: { id: bugId }
    });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteComment/${commentId}`, { observe: 'response' });
  }
}
