import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BugsService } from '../../services/bugs.service';
import { Bug } from '../../models/bug.model';
import { BugFormComponent } from '../../components/bug-form/bug-form.component';

@Component({
  selector: 'app-bug-create-page',
  template: `
    <div class="page-header">
      <h2>Create New Bug</h2>
    </div>
    <app-bug-form
      (submitForm)="onSubmit($event)"
      (cancel)="onCancel()"
    ></app-bug-form>
  `,
  styles: [`
    .page-header {
      padding: 20px;
      h2 {
        margin: 0;
      }
    }
  `],
  standalone: true,
  imports: [BugFormComponent]
})
export class BugCreatePageComponent {
  constructor(
    private router: Router,
    private bugsService: BugsService
  ) { }

  onSubmit(bug: Bug): void {
    this.bugsService.createBug(bug).subscribe({
      next: (createdBug) => {
        this.router.navigate(['/bugs', createdBug.id]);
      },
      error: (err) => {
        console.error('Error creating bug:', err);
        // TODO: Show error message to user
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/bugs']);
  }
} 