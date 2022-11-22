import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { SalesRoutingModule } from './sales-routing.module';
import { IndexSaleComponent } from './index-sale/index-sale.component';
import { CreateSaleComponent } from './create-sale/create-sale.component';
import { DetailsSaleComponent } from './details-sale/details-sale.component';

@NgModule({
  declarations: [
    IndexSaleComponent,
    CreateSaleComponent,
    DetailsSaleComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
