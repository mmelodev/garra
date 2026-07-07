import { Routes } from '@angular/router';

import { adminGuard, authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    path: 'professores',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/professores/professor-list/professor-list.component').then(
        (m) => m.ProfessorListComponent
      ),
  },
  {
    path: 'professores/novo',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/professores/professor-form/professor-form.component').then(
        (m) => m.ProfessorFormComponent
      ),
  },
  {
    path: 'professores/:id/editar',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/professores/professor-form/professor-form.component').then(
        (m) => m.ProfessorFormComponent
      ),
  },
  {
    path: 'alunos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/alunos/aluno-list/aluno-list.component').then((m) => m.AlunoListComponent),
  },
  {
    path: 'alunos/novo',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/alunos/aluno-form/aluno-form.component').then((m) => m.AlunoFormComponent),
  },
  {
    path: 'alunos/:id/editar',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/alunos/aluno-form/aluno-form.component').then((m) => m.AlunoFormComponent),
  },
  {
    path: 'financeiro/transacoes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/financeiro/transacoes/transacoes.component').then(
        (m) => m.TransacoesComponent
      ),
  },
  {
    path: 'financeiro/entradas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/financeiro/financeiro-entrada-list/financeiro-entrada-list.component').then(
        (m) => m.FinanceiroEntradaListComponent
      ),
  },
  {
    path: 'financeiro/entradas/novo',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/financeiro/financeiro-entrada-form/financeiro-entrada-form.component').then(
        (m) => m.FinanceiroEntradaFormComponent
      ),
  },
  {
    path: 'financeiro/entradas/:id/editar',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/financeiro/financeiro-entrada-form/financeiro-entrada-form.component').then(
        (m) => m.FinanceiroEntradaFormComponent
      ),
  },
  {
    path: 'financeiro/saidas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/financeiro/financeiro-saida-list/financeiro-saida-list.component').then(
        (m) => m.FinanceiroSaidaListComponent
      ),
  },
  {
    path: 'financeiro/saidas/novo',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/financeiro/financeiro-saida-form/financeiro-saida-form.component').then(
        (m) => m.FinanceiroSaidaFormComponent
      ),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
