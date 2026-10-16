import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, AuthUser, LoginRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly user = signal<AuthUser | null>(this.readUser());

  get accessToken() {
    return localStorage.getItem('accessToken');
  }

  get refreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn() {
    return !!this.accessToken;
  }

  login(credentials: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((res) => this.saveSession(res)));
  }

  refresh() {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {
        refreshToken: this.refreshToken,
      })
      .pipe(tap((res) => this.saveSession(res)));
  }

   logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.user.set(res.user);
  }

  private readUser(): AuthUser | null {
    try {
      return JSON.parse(localStorage.getItem('user') ?? 'null');
    } catch {
      return null;
    }
  }
}