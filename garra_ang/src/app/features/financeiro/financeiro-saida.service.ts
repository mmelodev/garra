import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { environment } from '@environments/environment';
import {
  DadosFinanceiroSaida,
  DadosFinanceiroSaidaG,
  DadosListagemSaida,
  PageResponse,
  PageableParams,
} from '@models';

import { HttpErrorHandlerService } from '../../core/services/http-error-handler.service';
import { buildPageableParams } from '../../core/services/pageable.util';

/**
 * O back-end não expõe PUT/DELETE para /financeiro/saidas (ver backend-api.md),
 * por isso este service não possui update()/delete() — apenas os métodos que a
 * API realmente disponibiliza.
 */
@Injectable({ providedIn: 'root' })
export class FinanceiroSaidaService {
  private readonly http = inject(HttpClient);
  private readonly erroHandler = inject(HttpErrorHandlerService);
  private readonly baseUrl = `${environment.apiUrl}/financeiro/saidas`;

  getAll(pageable?: PageableParams): Observable<DadosListagemSaida[]> {
    const params = buildPageableParams(pageable);
    return this.http.get<PageResponse<DadosListagemSaida>>(this.baseUrl, { params }).pipe(
      map((pagina) => pagina.content),
      catchError((erro) => this.tratarErro(erro, 'carregar as saídas financeiras'))
    );
  }

  getById(id: number): Observable<DadosFinanceiroSaidaG> {
    return this.http
      .get<DadosFinanceiroSaidaG>(`${this.baseUrl}/${id}`)
      .pipe(catchError((erro) => this.tratarErro(erro, 'carregar a saída financeira')));
  }

  create(dto: DadosFinanceiroSaida): Observable<DadosFinanceiroSaidaG> {
    return this.http
      .post<DadosFinanceiroSaidaG>(this.baseUrl, dto)
      .pipe(catchError((erro) => this.tratarErro(erro, 'cadastrar a saída financeira')));
  }

  private tratarErro(erro: HttpErrorResponse, contexto: string): Observable<never> {
    return throwError(() => new Error(this.erroHandler.paraMensagemAmigavel(erro, contexto)));
  }
}
