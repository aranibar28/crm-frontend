import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexEmployeeComponent } from './index-employee/index-employee.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { UpdateEmployeeComponent } from './update-employee/update-employee.component';

const routes: Routes = [
  { path: '', component: IndexEmployeeComponent },
  { path: 'create', component: CreateEmployeeComponent, data: { subtitle: 'Crear'} },
  { path: 'update/:id', component: UpdateEmployeeComponent, data: { subtitle: 'Actualizar'}  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
