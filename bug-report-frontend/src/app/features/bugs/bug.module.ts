import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { BugListComponent } from './components/bug-list/bug-list.component';
import { BugDetailComponent } from './components/bug-detail/bug-detail.component';
import { BugFormComponent } from './components/bug-form/bug-form.component';
import { BugDetailPageComponent } from './pages/bug-detail-page/bug-detail-page.component';
import { BugEditPageComponent } from './pages/bug-edit-page/bug-edit-page.component';
import { BugCreatePageComponent } from './pages/bug-create-page/bug-create-page.component';
import { BugsRoutingModule } from './bugs-routing.module';
import { BugService } from './services/bug.service';

@NgModule({
  declarations: [
    BugListComponent,
    BugDetailComponent,
    BugFormComponent,
    BugDetailPageComponent,
    BugEditPageComponent,
    BugCreatePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    BugsRoutingModule
  ],
  providers: [
    BugService
  ],
  exports: [
    BugListComponent,
    BugDetailComponent,
    BugFormComponent
  ]
})
export class BugModule { } 