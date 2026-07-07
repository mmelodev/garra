import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type UiBadgeVariant = 'positive' | 'negative' | 'neutral' | 'accent';

const VARIANT_CLASSES: Record<UiBadgeVariant, string> = {
  positive: 'bg-positive-50 text-positive-600',
  negative: 'bg-negative-50 text-negative-600',
  accent: 'bg-accent-100 text-accent-600',
  neutral: 'bg-gray-100 text-gray-700',
};

@Component({
  selector: 'ui-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-badge.component.html',
})
export class UiBadgeComponent {
  readonly variant = input<UiBadgeVariant>('neutral');

  protected get classes(): string {
    return `inline-flex items-center rounded-pill px-2.5 py-0.5 text-caption font-medium ${VARIANT_CLASSES[this.variant()]}`;
  }
}
