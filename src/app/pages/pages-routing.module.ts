import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core/core.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: 'auth', 
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: '',
    component: CoreComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./core/account/account.module').then((m) => m.AccountModule),
        data: { title: 'Dashboard' }
      },
      {
        path: 'employees',
        loadChildren: () => import('./core/employees/employees.module').then((m) => m.EmployeesModule),
        data: { title: 'Empleados' }
      },
      {
        path: 'customers',
        loadChildren: () => import('./core/customers/customers.module').then((m) => m.CustomersModule),
        data: { title: 'Clientes' }
      },
      {
        path: 'categories',
        loadChildren: () => import('./core/categories/categories.module').then((m) => m.CategoriesModule),
        data: { title: 'Categorias' }
      },
      {
        path: 'products',
        loadChildren: () => import('./core/products/products.module').then((m) => m.ProductsModule),
        data: { title: 'Productos' }
      },
      {
        path: 'inventories',
        loadChildren: () => import('./core/inventories/inventories.module').then((m) => m.InventoriesModule),
        data: { title: 'Inventarios' }
      },
      {
        path: 'sales',
        loadChildren: () => import('./core/sales/sales.module').then((m) => m.SalesModule),
        data: { title: 'Ventas' }
      },
      {
        path: 'courses',
        loadChildren: () => import('./core/courses/courses.module').then((m) => m.CoursesModule),
        data: { title: 'Cursos' }
      },
      {
        path: 'courses/cycles',
        loadChildren: () => import('./core/cycles/cycles.module').then((m) => m.CyclesModule),
        data: { title: 'Ciclos' }
      },
      {
        path: 'inscriptions',
        loadChildren: () => import('./core/inscriptions/inscriptions.module').then((m) => m.InscriptionsModule),
        data: { title: 'Matrículas' }
      },
      {
        path:'**',
        redirectTo: ''
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
