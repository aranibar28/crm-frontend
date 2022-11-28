import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core/core.component';
import { AuthGuard } from '../guards/auth.guard';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { ADMINISTRADOR, INSTRUCTOR, VENDEDOR, EMPLEADOS } from "../utils/roles"

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: CoreComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '', loadChildren: () => import('./core/account/account.module').then((m) => m.AccountModule),
        data: { title: 'Dashboard', role: EMPLEADOS },
      },
      {
        path: 'customers', loadChildren: () => import('./core/customers/customers.module').then((m) => m.CustomersModule),
        data: { title: 'Clientes', role: ADMINISTRADOR },
      },
      {
        path: 'employees', loadChildren: () => import('./core/employees/employees.module').then((m) => m.EmployeesModule),
        data: { title: 'Empleados', role: ADMINISTRADOR },
      },
      {
        path: 'categories', loadChildren: () => import('./core/categories/categories.module').then((m) => m.CategoriesModule),
        data: { title: 'Categorias', role: VENDEDOR },
      },
      {
        path: 'products', loadChildren: () => import('./core/products/products.module').then((m) => m.ProductsModule),
        data: { title: 'Productos', role: VENDEDOR },
      },
      {
        path: 'inventories', loadChildren: () => import('./core/inventories/inventories.module').then((m) => m.InventoriesModule),
        data: { title: 'Inventarios', role: VENDEDOR },
      },
      {
        path: 'sales', loadChildren: () => import('./core/sales/sales.module').then((m) => m.SalesModule),
        data: { title: 'Ventas', role: VENDEDOR },
      },
      {
        path: 'courses', loadChildren: () => import('./core/courses/courses.module').then((m) => m.CoursesModule),
        data: { title: 'Cursos', role: INSTRUCTOR},
      },
      {
        path: 'courses/cycles', loadChildren: () => import('./core/cycles/cycles.module').then((m) => m.CyclesModule),
        data: { title: 'Ciclos', role: INSTRUCTOR},
      },
      {
        path: 'inscriptions', loadChildren: () => import('./core/inscriptions/inscriptions.module').then((m) => m.InscriptionsModule),
        data: { title: 'Matrículas', role: INSTRUCTOR},
      },
      {
        path: '**', component: NotFoundComponent,
        data: { title: '404', role: EMPLEADOS },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
