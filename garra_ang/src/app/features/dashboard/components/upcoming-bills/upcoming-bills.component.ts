import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { UiBadgeVariant } from '../../../../shared/components/ui-badge/ui-badge.component';
import { UiBillItemComponent } from '../../../../shared/components/ui-bill-item/ui-bill-item.component';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';
import { DashboardContaProxima, DashboardStatusConta } from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';

const VARIANTE_POR_STATUS: Record<DashboardStatusConta, UiBadgeVariant> = {
  PENDENTE: 'accent',
  PAGO: 'positive',
  ATRASADO: 'negative',
};

const ROTULO_POR_STATUS: Record<DashboardStatusConta, string> = {
  PENDENTE: 'Pendente',
  PAGO: 'Pago',
  ATRASADO: 'Atrasado',
};

@Component({
  selector: 'app-upcoming-bills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, DatePipe, UiCardComponent, UiBillItemComponent],
  templateUrl: './upcoming-bills.component.html',
})
export class UpcomingBillsComponent {
  private readonly dashboardService = inject(DashboardService);

  protected readonly contas$: Observable<readonly DashboardContaProxima[]> =
    this.dashboardService.getProximasContas();

  protected readonly variantePorStatus = VARIANTE_POR_STATUS;
  protected readonly rotuloPorStatus = ROTULO_POR_STATUS;
}
