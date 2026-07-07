import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type UiCardPadding = 'none' | 'sm' | 'md' | 'lg';

const PADDING_CLASSES: Record<UiCardPadding, string> = {
  none: 'p-0',
  sm: 'p-md',
  md: 'p-lg',
  lg: 'p-xl',
};

@Component({
  selector: 'ui-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-card.component.html',
})
export class UiCardComponent {
  readonly padding = input<UiCardPadding>('md');
  readonly hoverable = input(false);

  protected get classes(): string {
    const base = `block rounded-card bg-surface shadow-card animate-card-in ${PADDING_CLASSES[this.padding()]}`;
    return this.hoverable() ? `${base} transition-shadow duration-200 hover:shadow-lg` : base;
  }
}
