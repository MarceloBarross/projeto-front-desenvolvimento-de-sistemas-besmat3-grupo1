import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
    {path: 'login', loadComponent: () => import('./layout/login/login').then(m => m.Login)},
    {
      path: 'main-layout',
      loadComponent: () =>
        import('./layout/main-layout/main-layout')
          .then(m => m.MainLayout),

      canActivate: [authGuard],

      children: [
        {
          path: 'dashboard',
          loadComponent: () =>
            import('./pages/dashboard/dashboard').then(m => m.Dashboard)
        },
        {
          path: 'edit-profile',
          loadComponent: () =>
            import('./pages/user/edit-profile/edit-profile').then(m => m.EditProfile)
        },
        {
          path: 'profile',
          loadComponent: () =>
            import('./pages/user/profile/profile').then(m => m.Profile)
        },
      //   {
      //     path: 'profissionais',
      //     loadComponent: () =>
      //       import('./pages/profissionais/profissionais')
      //         .then(m => m.ProfissionaisComponent)
      //   },
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        }
      ]
    },
    {path: '', redirectTo: 'login', pathMatch: 'full'},
];
