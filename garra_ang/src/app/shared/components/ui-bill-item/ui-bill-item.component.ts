import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UiBadgeComponent, UiBadgeVariant } from '../ui-badge/ui-badge.component';

@Component({
  selector: 'ui-bill-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, UiBadgeComponent],
  templateUrl: './ui-bill-item.component.html',
})
export class UiBillItemComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly value = input.required<number>();
  readonly badgeLabel = input<string | null>(null);
  readonly badgeVariant = input<UiBadgeVariant>('neutral');
}
