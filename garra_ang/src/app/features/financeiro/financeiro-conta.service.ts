import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '@environments/environment';
import { DadosContaG } from '@models';

import { HttpErrorHandlerService } from '../../core/services/http-error-handler.service';

/**
 * A conta financeira é criada implicitamente no cadastro do usuário
 * (ver AutenticacaoService.register); o back-end só expõe leitura de saldo.
 */
@Injectable({ providedIn: 'root' })
export class FinanceiroContaService {
  private readonly http = inject(HttpClient);
  private readonly erroHandler = inject(HttpErrorHandlerService);
  private readonly baseUrl = `${environment.apiUrl}/financeiro`;

  getSaldo(): Observable<DadosContaG> {
    return this.http
      .get<DadosContaG>(`${this.baseUrl}/saldo`)
      .pipe(catchError((erro) => this.tratarErro(erro, 'carregar o saldo')));
  }

  private tratarErro(erro: HttpErrorResponse, contexto: string): Observable<never> {
    return throwError(() => new Error(this.erroHandler.paraMensagemAmigavel(erro, contexto)));
  }
}
