import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';

import { ROTULOS_CATEGORIA_SAIDA } from '@models';

import { obterTokenCor } from '../../../../design-system/tokens';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';
import { DashboardCategoriaDespesa } from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';

const TOKENS_COR_CATEGORIA = [
  '--color-primary-900',
  '--color-primary-700',
  '--color-primary-600',
  '--color-primary-500',
  '--color-accent-500',
] as const;

const COR_CATEGORIA_RESIDUAL = '#d1d5db';

@Component({
  selector: 'app-expenses-donut',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CurrencyPipe, BaseChartDirective, UiCardComponent],
  templateUrl: './expenses-donut.component.html',
})
export class ExpensesDonutComponent {
  private readonly dashboardService = inject(DashboardService);

  protected readonly rotulos = ROTULOS_CATEGORIA_SAIDA;

  protected readonly categorias$: Observable<readonly DashboardCategoriaDespesa[]> =
    this.dashboardService.getDespesasPorCategoria();

  protected readonly chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: { legend: { display: false } },
  };

  protected construirChartData(categorias: readonly DashboardCategoriaDespesa[]): ChartData<'doughnut'> {
    return {
      labels: categorias.map((item) => ROTULOS_CATEGORIA_SAIDA[item.categoria]),
      datasets: [
        {
          data: categorias.map((item) => item.valor),
          backgroundColor: categorias.map((_, indice) =>
            indice < TOKENS_COR_CATEGORIA.length
              ? obterTokenCor(TOKENS_COR_CATEGORIA[indice])
              : COR_CATEGORIA_RESIDUAL
          ),
          borderWidth: 0,
        },
      ],
    };
  }

  protected corLegenda(indice: number): string {
    return indice < TOKENS_COR_CATEGORIA.length
      ? obterTokenCor(TOKENS_COR_CATEGORIA[indice])
      : COR_CATEGORIA_RESIDUAL;
  }
}
