import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { CreateProcessComponent } from './create-process/create-process.component';
import { ViewProcessComponent } from './view-process/view-process.component';
import { CompleteStepComponent } from './complete-step/complete-step.component';
import { BoardUserMangementComponent } from './board-user-management/board-user-management.component';
import { BoardContributions } from './board-contributions/board-contributions.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'steps', component: BoardUserComponent },
  { path: 'contribution', component: BoardContributions },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'create-process', component: CreateProcessComponent },
  { path: 'edit-process/:id', component: CreateProcessComponent },
  { path: 'view-process/:id', component: ViewProcessComponent },
  { path: 'complete-step/:id', component: CompleteStepComponent },
  { path: 'users', component: BoardUserMangementComponent },
  { path: 'create-user', component: RegisterComponent },
  { path: 'edit-user/:id', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
