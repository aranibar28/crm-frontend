import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateCycleComponent } from './create-cycle/create-cycle.component';
import { ExpiredCycleComponent } from './expired-cycle/expired-cycle.component';
import { IndexCycleComponent } from './index-cycle/index-cycle.component';
import { UpdateCycleComponent } from './update-cycle/update-cycle.component';

const routes: Routes = [
  { path: ':id', component: IndexCycleComponent },
  { path: ':id/expired', component: ExpiredCycleComponent },
  { path: ':id/create', component: CreateCycleComponent },
  { path: ':id/update/:cycle', component: UpdateCycleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CyclesRoutingModule {}
