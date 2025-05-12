import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class CommentService extends BaseService {
    constructor(http: HttpClient) {
        super(http);
    }

    getCommentsForBug(bugId: number): Observable<Comment[]> {
        return this.get<Comment[]>(`/comment/getCommentsForBug/${bugId}`);
    }

    addComment(comment: Partial<Comment>): Observable<Comment> {
        return this.post<Comment>('/comment/addComment', comment);
    }

    updateComment(id: number, comment: Partial<Comment>): Observable<Comment> {
        return this.put<Comment>(`/comment/updateComment/${id}`, comment);
    }

    deleteComment(id: number): Observable<string> {
        return this.delete<string>(`/comment/deleteComment/${id}`);
    }
} 