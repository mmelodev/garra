import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

interface CampoErro {
  campo: string;
  mensagem: string;
}

/**
 * Traduz respostas de erro HTTP do back-end (ver domain/exception/HttpExceptionHandler
 * em backend-api.md) em mensagens amigáveis para exibição ao usuário.
 */
@Injectable({ providedIn: 'root' })
export class HttpErrorHandlerService {
  paraMensagemAmigavel(erro: HttpErrorResponse, contexto: string): string {
    if (erro.status === 0) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    }

    if (erro.status === 400) {
      if (Array.isArray(erro.error)) {
        const mensagens = (erro.error as CampoErro[])
          .map((item) => item?.mensagem)
          .filter((mensagem): mensagem is string => !!mensagem);
        if (mensagens.length) {
          return mensagens.join(' ');
        }
      }
      if (typeof erro.error === 'string' && erro.error.trim()) {
        return erro.error;
      }
      return `Dados inválidos ao ${contexto}.`;
    }

    if (erro.status === 404) {
      return `Não foi possível encontrar o registro ao ${contexto}.`;
    }

    // Não há handler dedicado a 401/403 no back-end; falhas de token também podem
    // chegar como 500 (ver backend-api.md, seção Segurança).
    if (erro.status === 401 || erro.status === 403 || erro.status === 500) {
      return 'Sua sessão expirou ou você não tem permissão para esta ação. Faça login novamente.';
    }

    return `Erro inesperado ao ${contexto}. Tente novamente mais tarde.`;
  }
}
