import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { UiBillItemComponent } from '../../../../shared/components/ui-bill-item/ui-bill-item.component';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';
import { DashboardTransacaoRecente } from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';

type FiltroTransacao = 'todas' | 'entrada' | 'saida';

@Component({
  selector: 'app-last-transaction',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, DatePipe, UiCardComponent, UiBillItemComponent],
  templateUrl: './last-transaction.component.html',
})
export class LastTransactionComponent {
  private readonly dashboardService = inject(DashboardService);

  protected readonly transacoes$: Observable<readonly DashboardTransacaoRecente[]> =
    this.dashboardService.getTransacoesRecentes();

  protected readonly filtro = signal<FiltroTransacao>('todas');

  protected filtrar(transacoes: readonly DashboardTransacaoRecente[]): DashboardTransacaoRecente[] {
    const filtroAtual = this.filtro();
    return filtroAtual === 'todas'
      ? [...transacoes]
      : transacoes.filter((transacao) => transacao.tipo === filtroAtual);
  }

  protected definirFiltro(filtro: FiltroTransacao): void {
    this.filtro.set(filtro);
  }
}
