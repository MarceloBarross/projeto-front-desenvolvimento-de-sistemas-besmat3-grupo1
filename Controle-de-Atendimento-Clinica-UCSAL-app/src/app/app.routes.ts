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
        {
          path: 'profissionals',
          children: [
            {
              path: '',
              loadComponent: () =>
                import('./pages/profissionals/profissionals-list/profissionals-list').then(m => m.ProfissionalsList)
            },
            {
              path: 'create',
              loadComponent: () =>
                import('./pages/profissionals/profissionals-create/profissionals-create').then(m => m.ProfissionalsCreate)
            },
            {
              path: 'update/:id',
              loadComponent: () =>
                import('./pages/profissionals/profissionals-create/profissionals-create').then(m => m.ProfissionalsCreate)
            }
          ]
        },
        {
          path: 'patients',
          children: [
            {
              path: '',
              loadComponent: () =>
                import('./pages/patient/patient-list/patient-list').then(m => m.PatientList)
            },
            {
              path: 'create',
              loadComponent: () =>
                import('./pages/patient/patient-create/patient-create').then(m => m.PatientCreate)
            },
            {
              path: 'update/:id',
              loadComponent: () =>
                import('./pages/patient/patient-create/patient-create').then(m => m.PatientCreate)
            }
          ]
        },
        {
          path: 'consultations',
          children: [
            {
              path: '',
              loadComponent: () =>
                import('./pages/consultation/consultation-list/consultation-list').then(m => m.ConsultationList)
            },
            {
              path: 'create',
              loadComponent: () =>
                import('./pages/consultation/consultation-create/consultation-create').then(m => m.ConsultationCreate)
            },
            {
              path: 'continue/:id',
              loadComponent: () =>
                import('./pages/consultation/consultation-continue/consultation-continue').then(m => m.ConsultationContinue)
            }
          ]
        },
        {
          path: 'ies',
          children: [
            {
              path: '',
              loadComponent: () =>
                import('./pages/ies/ies-list/ies-list').then(m => m.IesList)
            },
            {
              path: 'create',
              loadComponent: () =>
                import('./pages/ies/ies-create/ies-create').then(m => m.IesCreate)
            },
            {
              path: 'update/:id',
              loadComponent: () =>
                import('./pages/ies/ies-create/ies-create').then(m => m.IesCreate)
            }
          ]
        },
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        }
      ]
    },
    {path: '', redirectTo: 'login', pathMatch: 'full'},
];
