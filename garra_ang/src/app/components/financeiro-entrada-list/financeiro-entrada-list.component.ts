import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subject, catchError, finalize, of, startWith, switchMap } from 'rxjs';

import { DadosListagemEntradas } from '@models';
import { FinanceiroEntradaService, SessaoService } from '../../services';

@Component({
  selector: 'app-financeiro-entrada-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './financeiro-entrada-list.component.html',
})
export class FinanceiroEntradaListComponent {
  private readonly financeiroEntradaService = inject(FinanceiroEntradaService);
  protected readonly sessaoService = inject(SessaoService);
  private readonly recarregar$ = new Subject<void>();

  readonly carregando = signal(true);
  readonly mensagemErro = signal<string | null>(null);

  readonly entradas$: Observable<DadosListagemEntradas[]> = this.recarregar$.pipe(
    startWith(undefined),
    switchMap(() => {
      this.carregando.set(true);
      this.mensagemErro.set(null);
      return this.financeiroEntradaService.getAll().pipe(
        catchError((erro: Error) => {
          this.mensagemErro.set(erro.message);
          return of<DadosListagemEntradas[]>([]);
        }),
        finalize(() => this.carregando.set(false))
      );
    })
  );

  constructor() {
    effect(() => {
      if (this.mensagemErro()) {
        console.error(`[FinanceiroEntradaList] ${this.mensagemErro()}`);
      }
    });
  }

  recarregar(): void {
    this.recarregar$.next();
  }
}
