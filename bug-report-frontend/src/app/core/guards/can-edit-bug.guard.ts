import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { BugsService } from '../../features/bugs/services/bugs.service';

@Injectable({
  providedIn: 'root'
})
export class CanEditBugGuard {
  constructor(
    private authService: AuthService,
    private bugsService: BugsService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const bugId = Number(route.paramMap.get('id'));
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return new Observable(subscriber => subscriber.next(false));
    }

    return this.bugsService.getBugById(bugId).pipe(
      take(1),
      map(bug => {
        const canEdit = currentUser.moderator || bug.author.id === currentUser.id;
        
        if (!canEdit) {
          this.router.navigate(['/bugs', bugId]);
          return false;
        }
        
        return true;
      })
    );
  }
} 