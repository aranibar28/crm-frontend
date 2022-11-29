import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexManagementComponent } from './index-management/index-management.component';
import { PerformanceManagementComponent } from './performance-management/performance-management.component';
import { EarningsManagementComponent } from './earnings-management/earnings-management.component';

const routes: Routes = [
  { path: 'config', component: IndexManagementComponent },
  { path: 'performance', component: PerformanceManagementComponent },
  { path: 'earnings', component: EarningsManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}
