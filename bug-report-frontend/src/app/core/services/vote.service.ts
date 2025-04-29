import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vote, VoteCreateDto } from '../models/vote.model';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = `${environment.apiUrl}/votes`;

  constructor(private http: HttpClient) { }

  createVote(vote: VoteCreateDto): Observable<Vote> {
    return this.http.post<Vote>(this.apiUrl, vote);
  }

  deleteVote(targetId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${targetId}`);
  }

  getVotesByTarget(targetId: number): Observable<Vote[]> {
    return this.http.get<Vote[]>(`${this.apiUrl}/target/${targetId}`);
  }

  getUserVotes(): Observable<Vote[]> {
    return this.http.get<Vote[]>(`${this.apiUrl}/user`);
  }
} 