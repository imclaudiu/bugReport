import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BugListPageComponent } from './pages/bug-list-page/bug-list-page.component';
import { BugDetailPageComponent } from './pages/bug-detail-page/bug-detail-page.component';
import { BugCreatePageComponent } from './pages/bug-create-page/bug-create-page.component';
import { BugEditPageComponent } from './pages/bug-edit-page/bug-edit-page.component';
import { RoleGuard } from '../../core/guards/role.guard';

export const bugsRoutes: Routes = [
  { path: '', component: BugListPageComponent },
  { path: 'create', component: BugCreatePageComponent },
  { path: ':id', component: BugDetailPageComponent },
  { path: ':id/edit', component: BugEditPageComponent, canActivate: [RoleGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(bugsRoutes)],
  exports: [RouterModule]
})
export class BugsRoutingModule { } 