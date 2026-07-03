import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subject, catchError, finalize, of, startWith, switchMap } from 'rxjs';

import { DadosListagemProfessor } from '@models';
import { ProfessorService, SessaoService } from '../../services';

@Component({
  selector: 'app-professor-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './professor-list.component.html',
})
export class ProfessorListComponent {
  private readonly professorService = inject(ProfessorService);
  protected readonly sessaoService = inject(SessaoService);
  private readonly recarregar$ = new Subject<void>();

  readonly carregando = signal(true);
  readonly mensagemErro = signal<string | null>(null);

  readonly professores$: Observable<DadosListagemProfessor[]> = this.recarregar$.pipe(
    startWith(undefined),
    switchMap(() => {
      this.carregando.set(true);
      this.mensagemErro.set(null);
      return this.professorService.getAll().pipe(
        catchError((erro: Error) => {
          this.mensagemErro.set(erro.message);
          return of<DadosListagemProfessor[]>([]);
        }),
        finalize(() => this.carregando.set(false))
      );
    })
  );

  constructor() {
    effect(() => {
      if (this.mensagemErro()) {
        console.error(`[ProfessorList] ${this.mensagemErro()}`);
      }
    });
  }

  recarregar(): void {
    this.recarregar$.next();
  }
}
