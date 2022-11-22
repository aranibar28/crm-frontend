import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AppRoutingModule } from '../app-routing.module';
import { CoreComponent } from './core/core.component';

@NgModule({
  declarations: [
    CoreComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule
  ]
})
export class PagesModule { }
