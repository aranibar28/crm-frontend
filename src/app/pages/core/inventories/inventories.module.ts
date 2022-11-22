import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { InventoriesRoutingModule } from './inventories-routing.module';
import { IndexInventoryComponent } from './index-inventory/index-inventory.component';
import { EntryInventoryComponent } from './entry-inventory/entry-inventory.component';
import { ExitInventoryComponent } from './exit-inventory/exit-inventory.component';

@NgModule({
  declarations: [
    IndexInventoryComponent,
    EntryInventoryComponent,
    ExitInventoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    InventoriesRoutingModule,
  ],
})
export class InventoriesModule {}
