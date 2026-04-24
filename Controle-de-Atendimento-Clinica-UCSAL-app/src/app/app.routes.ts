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
            import('./pages/dashboard/dashboard').then(m => m.Dashboard),
          canActivate: [authGuard],
          data: {
            roles: ['ADMIN', 'PROFISSIONAL']
          }
        },
        {
          path: 'edit-profile',
          loadComponent: () =>
            import('./pages/user/edit-profile/edit-profile').then(m => m.EditProfile),
          canActivate: [authGuard],
          data: {
            roles: ['ADMIN', 'PROFISSIONAL']
          }
        },
        {
          path: 'profile',
          loadComponent: () =>
            import('./pages/user/profile/profile').then(m => m.Profile),
          canActivate: [authGuard],
          data: {
            roles: ['ADMIN', 'PROFISSIONAL']
          }
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
          ],
          canActivate: [authGuard],
          data: {
            roles: ['ADMIN']
          }
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
          ],
          canActivate: [authGuard],
          data: {
            roles: ['ADMIN']
          }
        },
        {
          path: 'ies-units',
          children: [
            {
              path: '',
              loadComponent: () =>
                import('./pages/ies-unit/ies-unit-list/ies-unit-list').then(m => m.IesUnitList)
            },
            {
              path: 'create',
              loadComponent: () =>
                import('./pages/ies-unit/ies-unit-create/ies-unit-create').then(m => m.IesUnitCreate)
            },
            {
              path: 'update/:id',
              loadComponent: () =>
                import('./pages/ies-unit/ies-unit-create/ies-unit-create').then(m => m.IesUnitCreate)
            }
          ],
          canActivate: [authGuard],
          data: {
            roles: ['ADMIN']
          }
        },
        {
          path: 'medications',
          children: [
            {
              path: '',
              loadComponent: () =>
                import('./pages/medication/medication-list/medication-list').then(m => m.MedicationList)
            },
            {
              path: 'create',
              loadComponent: () =>
                import('./pages/medication/medication-create/medication-create').then(m => m.MedicationCreate),
              canActivate: [authGuard],
              data: {
                roles: ['ADMIN']
              },
            }
          ]
        },
        {
          path: 'medication-requests',
          children: [
            {
              path: '',
              loadComponent: () =>
                import('./pages/medication-request/medication-request-list/medication-request-list').then(m => m.MedicationRequestList)
            },
            {
              path: 'create',
              loadComponent: () =>
                import('./pages/medication-request/medication-request-create/medication-request-create').then(m => m.MedicationRequestCreate)
            }
          ]
        },
        {
          path: 'shcools',
          children: [
            {
              path: '',
              loadComponent: () =>
                import('./pages/shcool/shcool-list/shcool-list').then(m => m.ShcoolList)
            },
            {
              path: 'create',
              loadComponent: () =>
                import('./pages/shcool/shcool-create/shcool-create').then(m => m.ShcoolCreate)
            },
            {
              path: 'update/:id',
              loadComponent: () =>
                import('./pages/shcool/shcool-create/shcool-create').then(m => m.ShcoolCreate)
            }
          ],
          canActivate: [authGuard],
          data: {
            roles: ['ADMIN']
          }
        },
        {
          path: 'reports',
          children: [
            {
              path: 'cost-center',
              loadComponent: () =>
                import('./pages/reports/cost-center-report/cost-center-report').then(m => m.CostCenterReport)
            }
          ],
          canActivate: [authGuard],
          data: {
            roles: ['ADMIN']
          }
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
