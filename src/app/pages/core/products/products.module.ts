import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { ProductsRoutingModule } from './products-routing.module';
import { UpdateProductComponent } from './update-product/update-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { IndexProductComponent } from './index-product/index-product.component';
import { InventoryProductComponent } from './inventory-product/inventory-product.component';

@NgModule({
  declarations: [
    UpdateProductComponent,
    CreateProductComponent,
    IndexProductComponent,
    InventoryProductComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ProductsRoutingModule,
  ],
})
export class ProductsModule {}
