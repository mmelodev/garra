import { Routes } from '@angular/router';

import { adminGuard, authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./components/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'professores',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/professor-list/professor-list.component').then(
        (m) => m.ProfessorListComponent
      ),
  },
  {
    path: 'professores/novo',
    canActivate: [authGuard, adminGuard],
    data: { titulo: 'Professor', voltarPara: '/professores' },
    loadComponent: () =>
      import('./components/cadastro-placeholder/cadastro-placeholder.component').then(
        (m) => m.CadastroPlaceholderComponent
      ),
  },
  {
    path: 'alunos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/aluno-list/aluno-list.component').then((m) => m.AlunoListComponent),
  },
  {
    path: 'alunos/novo',
    canActivate: [authGuard, adminGuard],
    data: { titulo: 'Aluno', voltarPara: '/alunos' },
    loadComponent: () =>
      import('./components/cadastro-placeholder/cadastro-placeholder.component').then(
        (m) => m.CadastroPlaceholderComponent
      ),
  },
  {
    path: 'financeiro/transacoes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/transacoes/transacoes.component').then((m) => m.TransacoesComponent),
  },
  {
    path: 'financeiro/entradas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/financeiro-entrada-list/financeiro-entrada-list.component').then(
        (m) => m.FinanceiroEntradaListComponent
      ),
  },
  {
    path: 'financeiro/entradas/novo',
    canActivate: [authGuard, adminGuard],
    data: { titulo: 'Entrada Financeira', voltarPara: '/financeiro/entradas' },
    loadComponent: () =>
      import('./components/cadastro-placeholder/cadastro-placeholder.component').then(
        (m) => m.CadastroPlaceholderComponent
      ),
  },
  {
    path: 'financeiro/saidas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/financeiro-saida-list/financeiro-saida-list.component').then(
        (m) => m.FinanceiroSaidaListComponent
      ),
  },
  {
    path: 'financeiro/saidas/novo',
    canActivate: [authGuard, adminGuard],
    data: { titulo: 'Saída Financeira', voltarPara: '/financeiro/saidas' },
    loadComponent: () =>
      import('./components/cadastro-placeholder/cadastro-placeholder.component').then(
        (m) => m.CadastroPlaceholderComponent
      ),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
