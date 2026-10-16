import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <h1>Sesión iniciada</h1>
    <p>{{ auth.user()?.email }} ({{ auth.user()?.role }})</p>
    <button (click)="auth.logout()">Cerrar sesión</button>
  `,
})
export class Home {
  protected readonly auth = inject(AuthService);
}