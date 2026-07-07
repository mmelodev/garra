import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';

import { obterTokenCor } from '../../../../design-system/tokens';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';
import { DashboardFluxoBruto, DashboardFluxoGranularidade, DashboardFluxoPeriodo } from '../../dashboard.model';
import { DashboardService, agruparFluxoPorPeriodo } from '../../dashboard.service';

const OPCOES_GRANULARIDADE: ReadonlyArray<{ label: string; valor: DashboardFluxoGranularidade }> = [
  { label: 'Semana', valor: 'semana' },
  { label: 'Mês', valor: 'mes' },
  { label: 'Ano', valor: 'ano' },
];

@Component({
  selector: 'app-cash-flow-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, BaseChartDirective, UiCardComponent],
  templateUrl: './cash-flow-chart.component.html',
})
export class CashFlowChartComponent {
  private readonly dashboardService = inject(DashboardService);

  protected readonly opcoesGranularidade = OPCOES_GRANULARIDADE;
  protected readonly granularidade = signal<DashboardFluxoGranularidade>('mes');

  protected readonly fluxoBruto$: Observable<DashboardFluxoBruto> = this.dashboardService.getFluxoBruto();

  protected readonly chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } },
  };

  protected definirGranularidade(granularidade: DashboardFluxoGranularidade): void {
    this.granularidade.set(granularidade);
  }

  protected construirFluxo(bruto: DashboardFluxoBruto): readonly DashboardFluxoPeriodo[] {
    return agruparFluxoPorPeriodo(bruto.entradas, bruto.saidas, this.granularidade());
  }

  protected construirChartData(fluxo: readonly DashboardFluxoPeriodo[]): ChartData<'line'> {
    return {
      labels: fluxo.map((periodo) => periodo.rotulo),
      datasets: [
        {
          label: 'Receitas',
          data: fluxo.map((periodo) => periodo.receitas),
          borderColor: obterTokenCor('--color-primary-600'),
          backgroundColor: obterTokenCor('--color-primary-100'),
          tension: 0.35,
          fill: true,
        },
        {
          label: 'Despesas',
          data: fluxo.map((periodo) => periodo.despesas),
          borderColor: obterTokenCor('--color-negative-600'),
          backgroundColor: obterTokenCor('--color-negative-50'),
          tension: 0.35,
          fill: true,
        },
      ],
    };
  }
}
