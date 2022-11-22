import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { EmployeesRoutingModule } from './employees-routing.module';
import { IndexEmployeeComponent } from './index-employee/index-employee.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { UpdateEmployeeComponent } from './update-employee/update-employee.component';

@NgModule({
  declarations: [
    IndexEmployeeComponent,
    CreateEmployeeComponent,
    UpdateEmployeeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    EmployeesRoutingModule,
  ],
})
export class EmployeesModule {}
