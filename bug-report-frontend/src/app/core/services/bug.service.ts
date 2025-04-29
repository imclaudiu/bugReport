import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class BugService extends BaseService {
    constructor(http: HttpClient) {
        super(http);
    }

    getAllBugs(): Observable<Bug[]> {
        return this.get<Bug[]>('/bug/getAllBugs');
    }

    getBugById(id: number): Observable<Bug> {
        return this.get<Bug>(`/bug/getBug/${id}`);
    }

    createBug(bug: Partial<Bug>): Observable<Bug> {
        return this.post<Bug>('/bug/addBug', bug);
    }

    updateBug(id: number, bug: Partial<Bug>): Observable<Bug> {
        return this.put<Bug>(`/bug/updateBug/${id}`, bug);
    }

    deleteBug(id: number): Observable<string> {
        return this.delete<string>(`/bug/deleteBug/${id}`);
    }
} 