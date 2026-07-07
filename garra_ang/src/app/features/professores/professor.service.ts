import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { environment } from '@environments/environment';
import {
  DadosAtualizarProfessor,
  DadosListagemProfessor,
  DadosProfessor,
  DadosProfessorG,
  PageResponse,
  PageableParams,
} from '@models';

import { HttpErrorHandlerService } from '../../core/services/http-error-handler.service';
import { buildPageableParams } from '../../core/services/pageable.util';

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private readonly http = inject(HttpClient);
  private readonly erroHandler = inject(HttpErrorHandlerService);
  private readonly baseUrl = `${environment.apiUrl}/professor`;

  getAll(pageable?: PageableParams): Observable<DadosListagemProfessor[]> {
    const params = buildPageableParams(pageable);
    return this.http.get<PageResponse<DadosListagemProfessor>>(this.baseUrl, { params }).pipe(
      map((pagina) => pagina.content),
      catchError((erro) => this.tratarErro(erro, 'carregar os professores'))
    );
  }

  getById(id: number): Observable<DadosProfessorG> {
    return this.http
      .get<DadosProfessorG>(`${this.baseUrl}/${id}/infoG`)
      .pipe(catchError((erro) => this.tratarErro(erro, 'carregar o professor')));
  }

  getByArea(area: string): Observable<DadosProfessorG[]> {
    return this.http
      .get<DadosProfessorG[]>(`${this.baseUrl}/area/${area}`)
      .pipe(catchError((erro) => this.tratarErro(erro, 'carregar os professores da área')));
  }

  create(dto: DadosProfessor): Observable<DadosProfessorG> {
    return this.http
      .post<DadosProfessorG>(this.baseUrl, dto)
      .pipe(catchError((erro) => this.tratarErro(erro, 'cadastrar o professor')));
  }

  update(id: number, dto: DadosAtualizarProfessor): Observable<DadosProfessorG> {
    return this.http
      .put<DadosProfessorG>(this.baseUrl, { ...dto, id })
      .pipe(catchError((erro) => this.tratarErro(erro, 'atualizar o professor')));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError((erro) => this.tratarErro(erro, 'excluir o professor')));
  }

  private tratarErro(erro: HttpErrorResponse, contexto: string): Observable<never> {
    return throwError(() => new Error(this.erroHandler.paraMensagemAmigavel(erro, contexto)));
  }
}
