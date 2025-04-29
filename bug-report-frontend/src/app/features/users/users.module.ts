import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { usersRoutes } from './users-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(usersRoutes),
    ReactiveFormsModule
  ]
})
export class UsersModule { } 