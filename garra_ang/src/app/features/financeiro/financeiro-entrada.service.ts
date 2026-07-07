import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { environment } from '@environments/environment';
import {
  DadosAtualizarFinanceiroEntrada,
  DadosFinanceiroEntrada,
  DadosFinanceiroEntradaG,
  DadosListagemEntradas,
  PageResponse,
  PageableParams,
} from '@models';

import { HttpErrorHandlerService } from '../../core/services/http-error-handler.service';
import { buildPageableParams } from '../../core/services/pageable.util';

/**
 * ⚠️ O back-end NÃO expõe PUT /financeiro/entradas hoje (ver backend-api.md) —
 * só POST (criar) e GET (listar/detalhe) estão confirmados. `update()` abaixo
 * foi adicionado por decisão do usuário, assumindo que o back-end vai
 * implementar PUT seguindo o mesmo contrato de `PUT /professor`/`PUT /aluno`
 * (corpo com `id`, sem path param) — até esse endpoint existir, chamadas a
 * `update()` retornam 404/405. Sem delete(): não há indício de endpoint
 * equivalente nem pedido para removê-lo.
 */
@Injectable({ providedIn: 'root' })
export class FinanceiroEntradaService {
  private readonly http = inject(HttpClient);
  private readonly erroHandler = inject(HttpErrorHandlerService);
  private readonly baseUrl = `${environment.apiUrl}/financeiro/entradas`;

  getAll(pageable?: PageableParams): Observable<DadosListagemEntradas[]> {
    const params = buildPageableParams(pageable);
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

  update(id: number, dto: DadosAtualizarFinanceiroEntrada): Observable<DadosFinanceiroEntradaG> {
    return this.http
      .put<DadosFinanceiroEntradaG>(this.baseUrl, { ...dto, id })
      .pipe(catchError((erro) => this.tratarErro(erro, 'atualizar a entrada financeira')));
  }

  private tratarErro(erro: HttpErrorResponse, contexto: string): Observable<never> {
    return throwError(() => new Error(this.erroHandler.paraMensagemAmigavel(erro, contexto)));
  }
}
