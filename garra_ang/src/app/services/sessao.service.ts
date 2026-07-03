import { Injectable, computed, signal } from '@angular/core';

import type { UserRole } from '@models';

import { decodificarPayloadJwt } from './jwt.util';

const CHAVE_TOKEN = 'garra_token';

/**
 * Guarda o JWT emitido por `POST /auth/login` em `localStorage` e expõe o
 * estado de autenticação e a role do usuário como signals, para que o
 * header (`AppComponent`), as listagens e os route guards reajam sem
 * subscribe manual.
 */
@Injectable({ providedIn: 'root' })
export class SessaoService {
  private readonly token = signal<string | null>(localStorage.getItem(CHAVE_TOKEN));

  private readonly payload = computed(() => {
    const tokenAtual = this.token();
    return tokenAtual ? decodificarPayloadJwt(tokenAtual) : null;
  });

  /**
   * Um token presente mas malformado ou expirado não conta como sessão
   * válida — sem essa checagem, um JWT corrompido em `localStorage`
   * deixaria o app "autenticado" sem conseguir extrair a role, quebrando a
   * exibição condicional do botão "Cadastrar".
   */
  readonly estaAutenticado = computed(() => {
    const dados = this.payload();
    return dados !== null && dados.exp * 1000 > Date.now();
  });

  readonly role = computed<UserRole | null>(() =>
    this.estaAutenticado() ? this.payload()!.role : null
  );

  readonly isAdmin = computed(() => this.role() === 'ADMIN');

  obterToken(): string | null {
    return this.token();
  }

  salvarToken(token: string): void {
    localStorage.setItem(CHAVE_TOKEN, token);
    this.token.set(token);
  }

  encerrarSessao(): void {
    localStorage.removeItem(CHAVE_TOKEN);
    this.token.set(null);
  }
}
