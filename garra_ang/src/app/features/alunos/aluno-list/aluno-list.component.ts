import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subject, catchError, finalize, of, startWith, switchMap } from 'rxjs';

import { DadosListagemAluno } from '@models';
import { SessaoService } from '../../../core/services';
import { AlunoService } from '../aluno.service';

@Component({
  selector: 'app-aluno-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './aluno-list.component.html',
})
export class AlunoListComponent {
  private readonly alunoService = inject(AlunoService);
  protected readonly sessaoService = inject(SessaoService);
  private readonly recarregar$ = new Subject<void>();

  readonly carregando = signal(true);
  readonly mensagemErro = signal<string | null>(null);

  readonly alunos$: Observable<DadosListagemAluno[]> = this.recarregar$.pipe(
    startWith(undefined),
    switchMap(() => {
      this.carregando.set(true);
      this.mensagemErro.set(null);
      return this.alunoService.getAll().pipe(
        catchError((erro: Error) => {
          this.mensagemErro.set(erro.message);
          return of<DadosListagemAluno[]>([]);
        }),
        finalize(() => this.carregando.set(false))
      );
    })
  );

  constructor() {
    effect(() => {
      if (this.mensagemErro()) {
        console.error(`[AlunoList] ${this.mensagemErro()}`);
      }
    });
  }

  recarregar(): void {
    this.recarregar$.next();
  }
}
