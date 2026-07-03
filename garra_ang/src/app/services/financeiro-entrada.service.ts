import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { environment } from '@environments/environment';
import {
  DadosFinanceiroEntrada,
  DadosFinanceiroEntradaG,
  DadosListagemEntradas,
  PageResponse,
  PageableParams,
} from '@models';

import { HttpErrorHandlerService } from './http-error-handler.service';
import { buildPageableParams } from './pageable.util';

/**
 * O back-end não expõe PUT/DELETE para /financeiro/entradas (ver backend-api.md),
 * por isso este service não possui update()/delete() — apenas os métodos que a
 * API realmente disponibiliza.
 */
@Injectable({ providedIn: 'root' })
export class FinanceiroEntradaService {
  private readonly http = inject(HttpClient);
  private readonly erroHandler = inject(HttpErrorHandlerService);
  private readonly baseUrl = `${environment.apiUrl}/financeiro/entradas`;

  getAll(pageable?: PageableParams): Observable<DadosListagemEntradas[]> {
    const params = buildPageableParams('paginacao', pageable);
    return this.http.get<PageResponse<DadosListagemEntradas>>(this.baseUrl, { params }).pipe(
      map((pagina) => pagina.content),
      catchError((erro) => this.tratarErro(erro, 'carregar as entradas financeiras'))
    );
  }

  getById(id: number): Observable<DadosFinanceiroEntradaG> {
    return this.http
      .get<DadosFinanceiroEntradaG>(`${this.baseUrl}/${id}`)
      .pipe(catchError((erro) => this.tratarErro(erro, 'carregar a entrada financeira')));
  }

  create(dto: DadosFinanceiroEntrada): Observable<DadosFinanceiroEntradaG> {
    return this.http
      .post<DadosFinanceiroEntradaG>(this.baseUrl, dto)
      .pipe(catchError((erro) => this.tratarErro(erro, 'cadastrar a entrada financeira')));
  }

  private tratarErro(erro: HttpErrorResponse, contexto: string): Observable<never> {
    return throwError(() => new Error(this.erroHandler.paraMensagemAmigavel(erro, contexto)));
  }
}
