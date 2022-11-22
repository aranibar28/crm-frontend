import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { CustomersRoutingModule } from './customers-routing.module';
import { IndexCustomerComponent } from './index-customer/index-customer.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';

import { TrackingCustomerModule } from './tracking-customer/tracking-customer.module';
import { TrackingCustomerComponent } from './tracking-customer/tracking-customer.component';

@NgModule({
  declarations: [
    IndexCustomerComponent,
    CreateCustomerComponent,
    UpdateCustomerComponent,
    TrackingCustomerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CustomersRoutingModule,
    TrackingCustomerModule,
  ],
})
export class CustomersModule {}
