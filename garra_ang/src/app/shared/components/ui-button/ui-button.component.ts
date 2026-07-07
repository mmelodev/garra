import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type UiButtonVariant = 'primary' | 'secondary';
type UiButtonType = 'button' | 'submit';

const VARIANT_CLASSES: Record<UiButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink-hover',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
};

@Component({
  selector: 'ui-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-button.component.html',
})
export class UiButtonComponent {
  readonly variant = input<UiButtonVariant>('primary');
  readonly type = input<UiButtonType>('button');
  readonly disabled = input(false);

  protected get classes(): string {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-control px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50';
    return `${base} ${VARIANT_CLASSES[this.variant()]}`;
  }
}
