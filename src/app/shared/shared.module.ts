import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingComponent } from './loading/loading.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ButtonSubmitComponent } from './button-submit/button-submit.component';
import { DataFoundComponent } from './data-found/data-found.component';
import { ButtonBackComponent } from './button-back/button-back.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    LoadingComponent,
    BreadcrumbsComponent,
    ButtonSubmitComponent,
    ButtonBackComponent,
    DataFoundComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule, 
    RouterModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    LoadingComponent,
    BreadcrumbsComponent,
    ButtonSubmitComponent,
    ButtonBackComponent,
    DataFoundComponent,
    NotFoundComponent,
  ],
})
export class SharedModule {}
