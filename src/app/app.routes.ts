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
    loadChildren: () => import('./views/auth/auth.routes').then(c => c.authRoutes)
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () => import('./views/products/product.routes').then(c => c.productRoutes)
  }
];
