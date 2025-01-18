import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./views/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () => import('./views/products/product.routes').then(c => c.productRoutes)
  }
];
