import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  // injecao de dependencias
  const authService = inject(AuthService);
  const router = inject(Router);
 
  // chega se o ususario esta autenticado se nn redireciona para login
  if(!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  // pega as roles da rota, se nn existir roles nessa rota libera acesso
  const rolesRequired = route.data['roles'] as string[];
  if (!rolesRequired || rolesRequired.length === 0) {
    return true;
  }

  // pega role do usuario logado
  const userRoles = authService.getRoles();

  // checa se as roles do ususario estao inclusas nas roles exigidas pela rota
  const hasRole = rolesRequired.some(role => userRoles.includes(role));

  // se sim retorna true, se nn redireciona para unauthorized
  if(hasRole) {
    return true;
  }
  return router.createUrlTree(['/unauthorized']); 
};
