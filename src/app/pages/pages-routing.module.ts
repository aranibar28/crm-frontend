import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core/core.component';
import { AuthGuard } from '../guards/auth.guard';
import { NotFoundComponent } from '../shared/not-found/not-found.component';

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
        data: { title: 'Dashboard', role: ['Administrador', 'Gerente', 'Vendedor', 'Instructor'] },
      },
      {
        path: 'categories', loadChildren: () => import('./core/categories/categories.module').then((m) => m.CategoriesModule),
        data: { title: 'Categorias', role: ['Administrador', 'Gerente', 'Vendedor'] },
      },
      {
        path: 'products', loadChildren: () => import('./core/products/products.module').then((m) => m.ProductsModule),
        data: { title: 'Productos', role: ['Administrador', 'Gerente', 'Vendedor'] },
      },
      {
        path: 'inventories', loadChildren: () => import('./core/inventories/inventories.module').then((m) => m.InventoriesModule),
        data: { title: 'Inventarios', role: ['Administrador', 'Gerente', 'Vendedor'] },
      },
      {
        path: 'sales', loadChildren: () => import('./core/sales/sales.module').then((m) => m.SalesModule),
        data: { title: 'Ventas', role: ['Administrador', 'Gerente', 'Vendedor'] },
      },
      {
        path: 'courses', loadChildren: () => import('./core/courses/courses.module').then((m) => m.CoursesModule),
        data: { title: 'Cursos', role: ['Administrador', 'Gerente', 'Instructor']},
      },
      {
        path: 'courses/cycles', loadChildren: () => import('./core/cycles/cycles.module').then((m) => m.CyclesModule),
        data: { title: 'Ciclos', role: ['Administrador', 'Gerente', 'Instructor']},
      },
      {
        path: 'inscriptions', loadChildren: () => import('./core/inscriptions/inscriptions.module').then((m) => m.InscriptionsModule),
        data: { title: 'Matrículas', role: ['Administrador', 'Gerente', 'Instructor']},
      },
      {
        path: 'employees', loadChildren: () => import('./core/employees/employees.module').then((m) => m.EmployeesModule),
        data: { title: 'Empleados', role: ['Administrador', 'Gerente'] },
      },
      {
        path: 'customers', loadChildren: () => import('./core/customers/customers.module').then((m) => m.CustomersModule),
        data: { title: 'Clientes', role: ['Administrador', 'Gerente', 'Vendedor', 'Instructor'] },
      },
      {
        path: '**', component: NotFoundComponent,
        data: { title: '404', role: ['Administrador', 'Gerente', 'Vendedor', 'Instructor'] },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
