import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type UiIconName =
  | 'dashboard'
  | 'transactions'
  | 'payments'
  | 'students'
  | 'teachers'
  | 'logout';

@Component({
  selector: 'ui-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-icon.component.html',
})
export class UiIconComponent {
  readonly name = input.required<UiIconName>();
}
