import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { UiBadgeComponent, UiBadgeVariant } from '../ui-badge/ui-badge.component';
import { UiCardComponent } from '../ui-card/ui-card.component';

export interface UiMetricCardVariation {
  readonly value: number;
  readonly label?: string;
  /** Quando `true`, um valor positivo é desfavorável (ex.: alta em despesas). */
  readonly invertido?: boolean;
}

@Component({
  selector: 'ui-metric-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, UiCardComponent, UiBadgeComponent],
  templateUrl: './ui-metric-card.component.html',
})
export class UiMetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly currency = input(true);
  readonly variation = input<UiMetricCardVariation | null>(null);

  protected readonly variacaoVariant = computed<UiBadgeVariant>(() => {
    const variacao = this.variation();
    if (!variacao) {
      return 'positive';
    }
    const favoravel = variacao.invertido ? variacao.value < 0 : variacao.value >= 0;
    return favoravel ? 'positive' : 'negative';
  });

  protected formatarVariacao(variacao: UiMetricCardVariation): string {
    const sinal = variacao.value >= 0 ? '+' : '';
    return `${sinal}${variacao.value.toFixed(1).replace('.', ',')}%`;
  }
}
