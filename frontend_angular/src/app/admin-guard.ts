import { CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

export const adminGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  const roles = authService.getUserRoles();
  return roles.includes('ROLE_ADMIN');
};

export const commisGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  const roles = authService.getUserRoles();
  const router = inject(Router);
  if (roles.includes('ROLE_ADMIN')) return true;
  if (roles.includes('ROLE_EMP')) return true;
  return false;
};