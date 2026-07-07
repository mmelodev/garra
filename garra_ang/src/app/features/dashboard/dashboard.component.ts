import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

// Dropdown de período (Mensal/Trimestral/Anual) desativado temporariamente:
// ainda não existe esse filtro na API. Reativar junto com o template quando o back-end suportar.
// import { UiDropdownComponent, UiDropdownOption } from '../../shared/components/ui-dropdown/ui-dropdown.component';
import { UiMetricCardComponent } from '../../shared/components/ui-metric-card/ui-metric-card.component';
import { CardPanelComponent } from './components/card-panel/card-panel.component';
import { CashFlowChartComponent } from './components/cash-flow-chart/cash-flow-chart.component';
import { ExpensesDonutComponent } from './components/expenses-donut/expenses-donut.component';
import { LastTransactionComponent } from './components/last-transaction/last-transaction.component';
import { UpcomingBillsComponent } from './components/upcoming-bills/upcoming-bills.component';
import { DashboardResumo } from './dashboard.model';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    UiMetricCardComponent,
    CardPanelComponent,
    CashFlowChartComponent,
    ExpensesDonutComponent,
    LastTransactionComponent
  ],
  //UpcomingBillsComponent -> adicionar posteriormente
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  protected readonly resumo$: Observable<DashboardResumo> = this.dashboardService.getResumo();

  // Dropdown de período (Mensal/Trimestral/Anual) desativado temporariamente:
  // ainda não existe esse filtro na API. Reativar quando o back-end suportar.
  // protected readonly periodos: UiDropdownOption[] = [
  //   { label: 'Mensal', value: 'monthly' },
  //   { label: 'Trimestral', value: 'quarterly' },
  //   { label: 'Anual', value: 'yearly' },
  // ];
  //
  // protected readonly periodoSelecionado = signal('monthly');
}
