import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import {
  DadosFinanceiroSaida,
  FinanceiroSaidaCategoria,
  ROTULOS_CATEGORIA_SAIDA,
  ROTULOS_TIPO_FINANCEIRO_SAIDA,
  TipoFinanceiroSaida,
} from '@models';

import { FinanceiroSaidaService } from '../financeiro-saida.service';

type CampoFormulario = 'valor' | 'categoria' | 'tipoFinanceiroSaida' | 'data' | 'hora' | 'descricao';

/** Formato exigido no campo de Data — validação de dia/mês plausíveis, não só dígitos. */
const PADRAO_DATA_BR = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

/** `1.234,56` → `1234.56`; `null`/vazio/inválido → `null`. */
function converterValorParaNumero(texto: string | null): number | null {
  if (!texto) {
    return null;
  }
  const numero = Number(texto.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(numero) ? numero : null;
}

/** @DecimalMin(0.01) @DecimalMax(9999999.99) no back-end — vazio fica a cargo de Validators.required. */
function valorEntreLimitesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const numero = converterValorParaNumero(control.value);
    return numero !== null && numero >= 0.01 && numero <= 9999999.99 ? null : { valorInvalido: true };
  };
}

@Component({
  selector: 'app-financeiro-saida-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './financeiro-saida-form.component.html',
})
export class FinanceiroSaidaFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly financeiroSaidaService = inject(FinanceiroSaidaService);
  private readonly router = inject(Router);

  readonly categorias = Object.entries(ROTULOS_CATEGORIA_SAIDA) as [FinanceiroSaidaCategoria, string][];
  readonly tipos = Object.entries(ROTULOS_TIPO_FINANCEIRO_SAIDA) as [TipoFinanceiroSaida, string][];

  readonly salvando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly formulario = this.fb.group({
    valor: this.fb.control<string | null>(null, [Validators.required, valorEntreLimitesValidator()]),
    categoria: this.fb.control<FinanceiroSaidaCategoria | null>(null, [Validators.required]),
    tipoFinanceiroSaida: this.fb.control<TipoFinanceiroSaida | null>(null, [Validators.required]),
    data: this.fb.control<string | null>(null, [Validators.required, Validators.pattern(PADRAO_DATA_BR)]),
    hora: this.fb.control<string | null>(null, [Validators.required]),
    descricao: this.fb.control<string | null>(null),
  });

  campoInvalido(nome: CampoFormulario): boolean {
    const campo = this.formulario.get(nome);
    return !!campo && campo.invalid && (campo.dirty || campo.touched);
  }

  salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erro.set(null);

    const valores = this.formulario.getRawValue();
    const dto: DadosFinanceiroSaida = {
      valor: converterValorParaNumero(valores.valor)!,
      categoria: valores.categoria!,
      tipoFinanceiroSaida: valores.tipoFinanceiroSaida!,
      data: this.combinarDataHora(valores.data, valores.hora)!,
      descricao: valores.descricao ?? undefined,
    };

    this.financeiroSaidaService
      .create(dto)
      .pipe(
        catchError((erro: Error) => {
          this.erro.set(erro.message);
          return of(null);
        }),
        finalize(() => this.salvando.set(false))
      )
      .subscribe((resultado) => {
        if (resultado) {
          this.router.navigateByUrl('/financeiro/saidas');
        }
      });
  }

  /** Formata a digitação livre para `dd/MM/yyyy` conforme o usuário digita, sem depender do date picker nativo. */
  protected formatarDigitacaoData(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const digitos = input.value.replace(/\D/g, '').slice(0, 8);
    let formatado = digitos;
    if (digitos.length > 4) {
      formatado = `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
    } else if (digitos.length > 2) {
      formatado = `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
    }
    this.formulario.controls.data.setValue(formatado);
  }

  /** Máscara monetária `000,00`: usuário digita só números, os 2 últimos viram centavos. */
  protected formatarValorDigitado(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const digitos = input.value.replace(/\D/g, '');
    if (!digitos) {
      this.formulario.controls.valor.setValue('');
      return;
    }
    this.formulario.controls.valor.setValue((Number(digitos) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }));
  }

  /** `dd/MM/yyyy` + `HH:mm` → `yyyy-MM-ddTHH:mm` (formato aceito pelo back-end, sem timezone). */
  private combinarDataHora(data: string | null, hora: string | null): string | undefined {
    if (!data || !PADRAO_DATA_BR.test(data)) {
      return undefined;
    }
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}T${hora || '00:00'}`;
  }
}
