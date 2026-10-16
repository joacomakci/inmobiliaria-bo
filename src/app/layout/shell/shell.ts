import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideBuilding2,
  LucideDynamicIcon,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideMenu,
  LucideMessageSquareText,
  LucideUserRound,
  LucideUsersRound,
  LucideX,
} from '@lucide/angular';
import { AuthService } from '../../core/auth/auth.service';
import { AuthUser } from '../../core/models/auth.model';

type Role = AuthUser['role'];

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideDynamicIcon],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(AuthService);

  readonly brand = 'Inmobiliaria';
  readonly user = this.auth.user;
  readonly menuOpen = signal(false);

  readonly icons = { menu: LucideMenu, close: LucideX, logout: LucideLogOut };

  private readonly items = [
    { label: 'Resumen', path: '/dashboard', icon: LucideLayoutDashboard, roles: ['admin'] as Role[] },
    { label: 'Consultas', path: '/leads', icon: LucideMessageSquareText, roles: ['admin', 'agente'] as Role[] },
    { label: 'Propiedades', path: '/properties', icon: LucideBuilding2, roles: ['admin', 'editor', 'agente'] as Role[] },
    { label: 'Agentes', path: '/agents', icon: LucideUsersRound, roles: ['admin'] as Role[] },
    { label: 'Usuarios', path: '/users', icon: LucideUserRound, roles: ['admin'] as Role[] },
  ];

  readonly navItems = computed(() => {
    const role = this.user()?.role;
    return this.items.filter((item) => !!role && item.roles.includes(role));
  });

  readonly initials = computed(() =>
    (this.user()?.email ?? '?').slice(0, 2).toUpperCase(),
  );

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
  }
}