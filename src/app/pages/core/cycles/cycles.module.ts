import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { CyclesRoutingModule } from './cycles-routing.module';
import { IndexCycleComponent } from './index-cycle/index-cycle.component';
import { CreateCycleComponent } from './create-cycle/create-cycle.component';
import { UpdateCycleComponent } from './update-cycle/update-cycle.component';
import { ExpiredCycleComponent } from './expired-cycle/expired-cycle.component';

@NgModule({
  declarations: [
    IndexCycleComponent,
    CreateCycleComponent,
    UpdateCycleComponent,
    ExpiredCycleComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CyclesRoutingModule,
  ],
})
export class CyclesModule {}
