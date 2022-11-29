import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { ManagementRoutingModule } from './management-routing.module';
import { IndexManagementComponent } from './index-management/index-management.component';
import { PerformanceManagementComponent } from './performance-management/performance-management.component';
import { EarningsManagementComponent } from './earnings-management/earnings-management.component';

@NgModule({
  declarations: [
    IndexManagementComponent,
    PerformanceManagementComponent,
    EarningsManagementComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ManagementRoutingModule,
  ],
})
export class ManagementModule {}
