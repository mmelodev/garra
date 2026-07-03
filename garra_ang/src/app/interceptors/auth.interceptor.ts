import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { SessaoService } from '../services/sessao.service';

/**
 * Anexa `Authorization: Bearer <token>` em toda requisição quando há sessão
 * ativa (ver "Ponto crítico" registrado em sessions/02-services.md — quase
 * todas as rotas do back-end exigem JWT, `SecurityFilter`/`STATELESS`).
 *
 * Também trata 401/403 em requisições autenticadas como sessão expirada:
 * encerra a sessão local e redireciona para /login, evitando que o usuário
 * fique preso numa tela que nunca vai carregar dados (ver "Próximos passos"
 * em sessions/04-form-autenticacao.md).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sessaoService = inject(SessaoService);
  const router = inject(Router);

  const token = sessaoService.obterToken();
  const requisicao = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {
      // Só desloga se a sessão já existia (evita interferir num 401/403 vindo
      // do próprio POST /auth/login com credenciais erradas, tratado à parte
      // em AutenticacaoService.login).
      if ((erro.status === 401 || erro.status === 403) && sessaoService.estaAutenticado()) {
        sessaoService.encerrarSessao();
        router.navigateByUrl('/login');
      }
      return throwError(() => erro);
    })
  );
};
