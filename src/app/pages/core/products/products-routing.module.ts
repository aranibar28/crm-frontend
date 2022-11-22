import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from './create-product/create-product.component';
import { IndexProductComponent } from './index-product/index-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { InventoryProductComponent } from './inventory-product/inventory-product.component';

const routes: Routes = [
  { path: '', component: IndexProductComponent },
  { path: 'create', component: CreateProductComponent },
  { path: 'update/:id', component: UpdateProductComponent },
  { path: 'inventory', component: InventoryProductComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
