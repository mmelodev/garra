import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '@environments/environment';
import { DadosAutenticacao, DadosRegistro, TokenJWT } from '@models';

import { HttpErrorHandlerService } from '../../core/services/http-error-handler.service';

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private readonly http = inject(HttpClient);
  private readonly erroHandler = inject(HttpErrorHandlerService);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(dto: DadosAutenticacao): Observable<TokenJWT> {
    return this.http.post<TokenJWT>(`${this.baseUrl}/login`, dto).pipe(
      catchError((erro: HttpErrorResponse) => {
        const mensagem =
          erro.status === 400 || erro.status === 401 || erro.status === 403
            ? 'Login ou senha inválidos.'
            : this.erroHandler.paraMensagemAmigavel(erro, 'entrar');
        return throwError(() => new Error(mensagem));
      })
    );
  }

  register(dto: DadosRegistro): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/register`, dto)
      .pipe(
        catchError((erro: HttpErrorResponse) =>
          throwError(() => new Error(this.erroHandler.paraMensagemAmigavel(erro, 'cadastrar o usuário')))
        )
      );
  }
}
