import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { CreateProcessComponent } from './create-process/create-process.component';
import { MatStepperModule } from '@angular/material/stepper';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { MatTableModule } from '@angular/material/table';
import { ViewProcessComponent } from './view-process/view-process.component';
import { CompleteStepComponent } from './complete-step/complete-step.component';
import { BoardUserMangementComponent } from './board-user-management/board-user-management.component';
import { BoardContributions } from './board-contributions/board-contributions.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardUserComponent,
    CreateProcessComponent,
    ViewProcessComponent,
    CompleteStepComponent,
    BoardUserMangementComponent,
    BoardContributions
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatExpansionModule,
    CdkAccordionModule,
    MatTableModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
