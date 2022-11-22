import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexSaleComponent } from './index-sale/index-sale.component';
import { CreateSaleComponent } from './create-sale/create-sale.component';
import { DetailsSaleComponent } from './details-sale/details-sale.component';

const routes: Routes = [
  { path: '', component: IndexSaleComponent },
  { path: 'create', component: CreateSaleComponent },
  { path: 'details/:id', component: DetailsSaleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
