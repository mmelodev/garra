import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { SessaoService } from '../../../../core/services';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';
import { DashboardResumo } from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-card-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CurrencyPipe, RouterLink, UiButtonComponent, UiCardComponent],
  templateUrl: './card-panel.component.html',
})
export class CardPanelComponent {
  private readonly dashboardService = inject(DashboardService);
  protected readonly sessaoService = inject(SessaoService);

  protected readonly resumo$: Observable<DashboardResumo> = this.dashboardService.getResumo();
}
