import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SessaoService } from '../services';

/**
 * Bloqueia rotas autenticadas quando não há sessão ativa (ver "Próximos
 * passos" em sessions/04-form-autenticacao.md). Sem isso, qualquer um
 * consegue navegar para /professores, /alunos, /financeiro/** mesmo
 * deslogado — a tela só falharia depois, ao chamar a API.
 */
export const authGuard: CanActivateFn = () => {
  const sessaoService = inject(SessaoService);
  const router = inject(Router);

  return sessaoService.estaAutenticado() ? true : router.createUrlTree(['/login']);
};

/**
 * Inverso do `authGuard`: mantém quem já está logado fora de /login e
 * /registro. Sem isso, um token válido ainda em localStorage faz a sidebar
 * aparecer por cima do formulário de login (a rota '' sempre redireciona
 * para /login, independente do estado de autenticação).
 */
export const guestGuard: CanActivateFn = () => {
  const sessaoService = inject(SessaoService);
  const router = inject(Router);

  return sessaoService.estaAutenticado() ? router.createUrlTree(['/professores']) : true;
};

/**
 * Bloqueia rotas de cadastro (Professor/Aluno/Entrada/Saída) para usuários
 * autenticados sem role ADMIN — o botão "Cadastrar" já fica escondido para
 * `USER` nas listagens, mas o guard evita que alguém chegue lá digitando a
 * URL direto (o back-end também rejeita esses `POST`s com `hasRole("ADMIN")`,
 * ver backend-api.md; este guard é só a camada de UX equivalente no front).
 */
export const adminGuard: CanActivateFn = () => {
  const sessaoService = inject(SessaoService);
  const router = inject(Router);

  return sessaoService.isAdmin() ? true : router.createUrlTree(['/professores']);
};
