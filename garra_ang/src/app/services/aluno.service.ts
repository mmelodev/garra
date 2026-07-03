import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { environment } from '@environments/environment';
import {
  DadosAluno,
  DadosAlunoG,
  DadosAtualizarAluno,
  DadosListagemAluno,
  PageResponse,
  PageableParams,
} from '@models';

import { HttpErrorHandlerService } from './http-error-handler.service';
import { buildPageableParams } from './pageable.util';

@Injectable({ providedIn: 'root' })
export class AlunoService {
  private readonly http = inject(HttpClient);
  private readonly erroHandler = inject(HttpErrorHandlerService);
  private readonly baseUrl = `${environment.apiUrl}/aluno`;

  getAll(pageable?: PageableParams): Observable<DadosListagemAluno[]> {
    const params = buildPageableParams('paginacao', pageable);
    return this.http.get<PageResponse<DadosListagemAluno>>(this.baseUrl, { params }).pipe(
      map((pagina) => pagina.content),
      catchError((erro) => this.tratarErro(erro, 'carregar os alunos'))
    );
  }

  getById(id: number): Observable<DadosAlunoG> {
    return this.http
      .get<DadosAlunoG>(`${this.baseUrl}/${id}/infoG`)
      .pipe(catchError((erro) => this.tratarErro(erro, 'carregar o aluno')));
  }

  create(dto: DadosAluno): Observable<DadosAlunoG> {
    return this.http
      .post<DadosAlunoG>(this.baseUrl, dto)
      .pipe(catchError((erro) => this.tratarErro(erro, 'cadastrar o aluno')));
  }

  update(id: number, dto: DadosAtualizarAluno): Observable<DadosAlunoG> {
    return this.http
      .put<DadosAlunoG>(this.baseUrl, { ...dto, id })
      .pipe(catchError((erro) => this.tratarErro(erro, 'atualizar o aluno')));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError((erro) => this.tratarErro(erro, 'excluir o aluno')));
  }

  private tratarErro(erro: HttpErrorResponse, contexto: string): Observable<never> {
    return throwError(() => new Error(this.erroHandler.paraMensagemAmigavel(erro, contexto)));
  }
}
