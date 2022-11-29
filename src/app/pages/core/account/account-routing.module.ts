import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexAccountComponent } from './index-account/index-account.component';
import { ProfileAccountComponent } from './profile-account/profile-account.component';

const routes: Routes = [
  { path: '', component: IndexAccountComponent },
  { path: 'profile', component: ProfileAccountComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
