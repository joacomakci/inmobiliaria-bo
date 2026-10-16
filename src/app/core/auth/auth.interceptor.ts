import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isAuthEndpoint =
    req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

  if (!isApiRequest || isAuthEndpoint) {
    return next(req);
  }

  const withToken = (token: string | null) =>
    token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(withToken(auth.accessToken)).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || !auth.refreshToken) {
        return throwError(() => err);
      }

      return auth.refresh().pipe(
        catchError((refreshError) => {
          auth.logout();
          return throwError(() => refreshError);
        }),
        switchMap((res) => next(withToken(res.accessToken))),
      );
    }),
  );
};