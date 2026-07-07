import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export interface UiDropdownOption {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-dropdown.component.html',
})
export class UiDropdownComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly options = input<readonly UiDropdownOption[]>([]);
  readonly value = input<string | null>(null);
  readonly placeholder = input('Selecionar');

  readonly valueChange = output<string>();

  protected readonly aberto = signal(false);

  protected get selecionado(): UiDropdownOption | null {
    return this.options().find((opcao) => opcao.value === this.value()) ?? null;
  }

  protected alternar(): void {
    this.aberto.update((aberto) => !aberto);
  }

  protected selecionar(opcao: UiDropdownOption): void {
    this.valueChange.emit(opcao.value);
    this.aberto.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected aoClicarFora(evento: MouseEvent): void {
    if (this.aberto() && !this.elementRef.nativeElement.contains(evento.target as Node)) {
      this.aberto.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected aoPressionarEsc(): void {
    this.aberto.set(false);
  }
}
