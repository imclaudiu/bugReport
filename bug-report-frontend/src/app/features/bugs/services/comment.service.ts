import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
      map(comments => {
        // Convert dates to Date objects
        const processedComments = comments.map(comment => ({
          ...comment,
          date: new Date(comment.date)
        }));

        // Separate parent comments and replies
        const parentComments = processedComments.filter(comment => !comment.parent);
        const replies = processedComments.filter(comment => comment.parent);

        // Organize replies under their parent comments
        return parentComments.map(parent => ({
          ...parent,
          replies: replies
            .filter(reply => reply.parent?.id === parent.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }),
      catchError(error => {
        console.error('Error fetching comments:', error);
        return throwError(() => error);
      })
    );
  }

  getCommentById(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/getComment/${commentId}`);
  }

  createComment(bugId: number, text: string, imageURL: string, parentId?: number): Observable<Comment> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User must be logged in to comment'));
    }

    const now = new Date().toISOString();
    const comment = {
      text,
      imageURL,
      bug: { id: bugId },
      author: { id: currentUser.id },
      date: now,
      voteCount: 0
    };

    if (parentId) {
      return this.http.post<Comment>(`${this.apiUrl}/addReply`, {
        ...comment,
        parent: { id: parentId }
      });
    } else {
      return this.http.post<Comment>(`${this.apiUrl}/addComment`, comment);
    }
  }

  updateComment(commentId: number, bugId: number, text: string, imageURL: string): Observable<Comment> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User must be logged in to update comment'));
    }

    const now = new Date().toISOString();
    return this.http.put<Comment>(`${this.apiUrl}/editComment/${commentId}`, {
      text,
      imageURL,
      date: now,
      author: { id: currentUser.id },
      bug: { id: bugId }
    });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteComment/${commentId}`, { observe: 'response' });
  }
}
