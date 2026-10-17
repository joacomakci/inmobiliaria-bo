import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { authGuard, homeRedirectGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', canActivate: [homeRedirectGuard], children: [] },
      {
        path: 'dashboard',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard').then((m) => m.Dashboard),
      },
            {
        path: 'leads',
        canActivate: [roleGuard('admin', 'agente')],
        loadComponent: () => import('./features/leads/leads/leads').then((m) => m.Leads),
      },
      {
        path: 'leads/:id',
        canActivate: [roleGuard('admin', 'agente')],
        loadComponent: () =>
          import('./features/leads/lead-detail/lead-detail').then((m) => m.LeadDetail),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];