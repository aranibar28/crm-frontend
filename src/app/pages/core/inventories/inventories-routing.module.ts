import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexInventoryComponent } from './index-inventory/index-inventory.component';
import { EntryInventoryComponent } from './entry-inventory/entry-inventory.component';
import { ExitInventoryComponent } from './exit-inventory/exit-inventory.component';

const routes: Routes = [
  { path: '', component: IndexInventoryComponent },
  { path: 'entry', component: EntryInventoryComponent },
  { path: 'exit', component: ExitInventoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoriesRoutingModule {}
