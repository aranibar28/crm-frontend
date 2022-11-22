import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { AccountRoutingModule } from './account-routing.module';
import { IndexAccountComponent } from './index-account/index-account.component';
import { ProfileAccountComponent } from './profile-account/profile-account.component';
import { ConfigAccountComponent } from './config-account/config-account.component';
import { PerformanceAccountComponent } from './performance-account/performance-account.component';

@NgModule({
  declarations: [
    IndexAccountComponent,
    ProfileAccountComponent,
    ConfigAccountComponent,
    PerformanceAccountComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AccountRoutingModule,
  ],
})
export class AccountModule {}
