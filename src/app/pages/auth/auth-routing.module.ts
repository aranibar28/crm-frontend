import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignedInGuard } from 'src/app/guards/signed.guard';

import { LoginComponent } from './login/login.component';
import { SurveyComponent } from './survey/survey.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [SignedInGuard] },
  { path: 'verify/:token', component: VerifyComponent },
  { path: 'survey/:token', component: SurveyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
