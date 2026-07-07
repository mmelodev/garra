import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subject, catchError, finalize, of, startWith, switchMap } from 'rxjs';

import { DadosListagemSaida } from '@models';
import { SessaoService } from '../../../core/services';
import { FinanceiroSaidaService } from '../financeiro-saida.service';

@Component({
  selector: 'app-financeiro-saida-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './financeiro-saida-list.component.html',
})
export class FinanceiroSaidaListComponent {
  private readonly financeiroSaidaService = inject(FinanceiroSaidaService);
  protected readonly sessaoService = inject(SessaoService);
  private readonly recarregar$ = new Subject<void>();

  readonly carregando = signal(true);
  readonly mensagemErro = signal<string | null>(null);

  readonly saidas$: Observable<DadosListagemSaida[]> = this.recarregar$.pipe(
    startWith(undefined),
    switchMap(() => {
      this.carregando.set(true);
      this.mensagemErro.set(null);
      return this.financeiroSaidaService.getAll().pipe(
        catchError((erro: Error) => {
          this.mensagemErro.set(erro.message);
          return of<DadosListagemSaida[]>([]);
        }),
        finalize(() => this.carregando.set(false))
      );
    })
  );

  constructor() {
    effect(() => {
      if (this.mensagemErro()) {
        console.error(`[FinanceiroSaidaList] ${this.mensagemErro()}`);
      }
    });
  }

  recarregar(): void {
    this.recarregar$.next();
  }
}
