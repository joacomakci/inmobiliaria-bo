import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthUser } from '../models/auth.model';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};

export const roleGuard =
  (...roles: AuthUser['role'][]): CanActivateFn =>
  () => {
    const role = inject(AuthService).user()?.role;
    return role && roles.includes(role) ? true : inject(Router).createUrlTree(['/']);
  };

  const HOME_BY_ROLE: Record<AuthUser['role'], string> = {
  admin: '/dashboard',
  agente: '/leads',
  editor: '/properties',
};

export const homeRedirectGuard: CanActivateFn = () => {
  const role = inject(AuthService).user()?.role;
  return inject(Router).createUrlTree([role ? HOME_BY_ROLE[role] : '/login']);
};