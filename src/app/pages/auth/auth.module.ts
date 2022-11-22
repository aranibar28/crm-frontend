import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SurveyComponent } from './survey/survey.component';
import { VerifyComponent } from './verify/verify.component';

@NgModule({
  declarations: [
    LoginComponent,
    SurveyComponent,
    VerifyComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
