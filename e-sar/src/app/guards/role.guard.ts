import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const roles = route.data['roles'];

  if (roles.includes(auth.getRole())) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;

};