import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Import standalone components
import { BugListComponent } from './components/bug-list/bug-list.component';
import { BugDetailComponent } from './components/bug-detail/bug-detail.component';
import { BugFormComponent } from './components/bug-form/bug-form.component';
import { BugListPageComponent } from './pages/bug-list-page/bug-list-page.component';
import { BugDetailPageComponent } from './pages/bug-detail-page/bug-detail-page.component';
import { BugCreatePageComponent } from './pages/bug-create-page/bug-create-page.component';
import { BugEditPageComponent } from './pages/bug-edit-page/bug-edit-page.component';

import { bugsRoutes } from './bugs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(bugsRoutes),
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    // Import standalone components
    BugListComponent,
    BugDetailComponent,
    BugFormComponent,
    BugListPageComponent,
    BugDetailPageComponent,
    BugCreatePageComponent,
    BugEditPageComponent
  ]
})
export class BugsModule { } 