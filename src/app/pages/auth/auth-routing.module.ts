import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SurveyComponent } from './survey/survey.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'verify/:token', component: VerifyComponent },
  { path: 'survey/:token', component: SurveyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
