import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import {
  DadosAtualizarFinanceiroEntrada,
  DadosFinanceiroEntrada,
  DadosListagemAluno,
  FinanceiroEntradaCategoria,
  ROTULOS_CATEGORIA_ENTRADA,
} from '@models';

import { AlunoService } from '../../alunos/aluno.service';
import { FinanceiroEntradaService } from '../financeiro-entrada.service';

type CampoFormulario =
  | 'valor'
  | 'categoria'
  | 'alunoId'
  | 'dataEvento'
  | 'horaEvento'
  | 'dataFimEvento'
  | 'horaFimEvento'
  | 'dataVencimento'
  | 'horaVencimento'
  | 'descricao';

type CampoData = 'dataEvento' | 'dataFimEvento' | 'dataVencimento';

const CATEGORIAS_COM_ALUNO_OBRIGATORIO: readonly FinanceiroEntradaCategoria[] = ['MENSALIDADE', 'MATRICULA'];

/** Formato exigido nos campos de data (Evento/Vencimento) — validação de dia/mês plausíveis, não só dígitos. */
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
  selector: 'app-financeiro-entrada-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './financeiro-entrada-form.component.html',
})
export class FinanceiroEntradaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly financeiroEntradaService = inject(FinanceiroEntradaService);
  private readonly alunoService = inject(AlunoService);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);

  readonly categorias = Object.entries(ROTULOS_CATEGORIA_ENTRADA) as [FinanceiroEntradaCategoria, string][];

  readonly alunos = signal<DadosListagemAluno[]>([]);
  readonly carregandoDados = signal(false);
  readonly salvando = signal(false);
  readonly erro = signal<string | null>(null);

  private readonly idParaEditar = Number(this.rota.snapshot.paramMap.get('id')) || null;
  readonly modoEdicao = this.idParaEditar !== null;

  readonly formulario = this.fb.group({
    valor: this.fb.control<string | null>(null, [Validators.required, valorEntreLimitesValidator()]),
    categoria: this.fb.control<FinanceiroEntradaCategoria | null>(null, [Validators.required]),
    alunoId: this.fb.control<number | null>(null),
    dataEvento: this.fb.control<string | null>(null, [Validators.pattern(PADRAO_DATA_BR)]),
    horaEvento: this.fb.control<string | null>(null),
    dataFimEvento: this.fb.control<string | null>(null, [Validators.pattern(PADRAO_DATA_BR)]),
    horaFimEvento: this.fb.control<string | null>(null),
    dataVencimento: this.fb.control<string | null>(null, [Validators.pattern(PADRAO_DATA_BR)]),
    horaVencimento: this.fb.control<string | null>(null),
    descricao: this.fb.control<string | null>(null),
  });

  constructor() {
    this.formulario.controls.categoria.valueChanges.subscribe((categoria) =>
      this.aplicarValidadoresPorCategoria(categoria)
    );
  }

  ngOnInit(): void {
    this.alunoService.getAll().subscribe({
      next: (alunos) => this.alunos.set(alunos),
      error: () => this.alunos.set([]),
    });

    if (this.idParaEditar !== null) {
      this.carregandoDados.set(true);
      this.financeiroEntradaService
        .getById(this.idParaEditar)
        .pipe(finalize(() => this.carregandoDados.set(false)))
        .subscribe({
          next: (entrada) => {
            const dataEvento = this.separarDataHora(entrada.dataEvento);
            const dataFimEvento = this.separarDataHora(entrada.dataFimEvento);
            const dataVencimento = this.separarDataHora(entrada.dataVencimento);
            this.formulario.patchValue({
              valor: this.formatarValorParaExibicao(entrada.valor),
              categoria: entrada.categoria,
              alunoId: entrada.alunoId ?? null,
              dataEvento: dataEvento.data,
              horaEvento: dataEvento.hora,
              dataFimEvento: dataFimEvento.data,
              horaFimEvento: dataFimEvento.hora,
              dataVencimento: dataVencimento.data,
              horaVencimento: dataVencimento.hora,
              descricao: entrada.descricao ?? null,
            });
            this.aplicarValidadoresPorCategoria(entrada.categoria);
          },
          error: (erro: Error) => this.erro.set(erro.message),
        });
    }
  }

  get categoriaSelecionada(): FinanceiroEntradaCategoria | null {
    return this.formulario.controls.categoria.value;
  }

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
    const dto: DadosFinanceiroEntrada = {
      valor: converterValorParaNumero(valores.valor)!,
      categoria: valores.categoria!,
      alunoId: valores.alunoId,
      dataEvento: this.combinarDataHora(valores.dataEvento, valores.horaEvento),
      dataFimEvento: this.combinarDataHora(valores.dataFimEvento, valores.horaFimEvento),
      dataVencimento: this.combinarDataHora(valores.dataVencimento, valores.horaVencimento),
      descricao: valores.descricao ?? undefined,
    };

    const requisicao =
      this.idParaEditar !== null
        ? this.financeiroEntradaService.update(this.idParaEditar, dto as DadosAtualizarFinanceiroEntrada)
        : this.financeiroEntradaService.create(dto);

    requisicao
      .pipe(
        catchError((erro: Error) => {
          this.erro.set(erro.message);
          return of(null);
        }),
        finalize(() => this.salvando.set(false))
      )
      .subscribe((resultado) => {
        if (resultado) {
          this.router.navigateByUrl('/financeiro/entradas');
        }
      });
  }

  private aplicarValidadoresPorCategoria(categoria: FinanceiroEntradaCategoria | null): void {
    const alunoId = this.formulario.controls.alunoId;
    const dataVencimento = this.formulario.controls.dataVencimento;
    const horaVencimento = this.formulario.controls.horaVencimento;
    const dataEvento = this.formulario.controls.dataEvento;
    const horaEvento = this.formulario.controls.horaEvento;

    alunoId.clearValidators();
    dataVencimento.clearValidators();
    horaVencimento.clearValidators();
    dataEvento.clearValidators();
    horaEvento.clearValidators();

    dataVencimento.addValidators(Validators.pattern(PADRAO_DATA_BR));
    dataEvento.addValidators(Validators.pattern(PADRAO_DATA_BR));

    if (categoria && CATEGORIAS_COM_ALUNO_OBRIGATORIO.includes(categoria)) {
      alunoId.addValidators(Validators.required);
    }
    if (categoria === 'MENSALIDADE') {
      dataVencimento.addValidators(Validators.required);
      horaVencimento.addValidators(Validators.required);
    }
    if (categoria === 'EVENTO') {
      dataEvento.addValidators(Validators.required);
      horaEvento.addValidators(Validators.required);
    }

    alunoId.updateValueAndValidity({ emitEvent: false });
    dataVencimento.updateValueAndValidity({ emitEvent: false });
    horaVencimento.updateValueAndValidity({ emitEvent: false });
    dataEvento.updateValueAndValidity({ emitEvent: false });
    horaEvento.updateValueAndValidity({ emitEvent: false });
  }

  /** Formata a digitação livre para `dd/MM/yyyy` conforme o usuário digita, sem depender do date picker nativo. */
  protected formatarDigitacaoData(evento: Event, nomeCampo: CampoData): void {
    const input = evento.target as HTMLInputElement;
    const digitos = input.value.replace(/\D/g, '').slice(0, 8);
    let formatado = digitos;
    if (digitos.length > 4) {
      formatado = `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
    } else if (digitos.length > 2) {
      formatado = `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
    }
    this.formulario.get(nomeCampo)?.setValue(formatado);
  }

  /** Máscara monetária `000,00`: usuário digita só números, os 2 últimos viram centavos. */
  protected formatarValorDigitado(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const digitos = input.value.replace(/\D/g, '');
    if (!digitos) {
      this.formulario.controls.valor.setValue('');
      return;
    }
    this.formulario.controls.valor.setValue(this.formatarValorParaExibicao(Number(digitos) / 100));
  }

  private formatarValorParaExibicao(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /** `dd/MM/yyyy` + `HH:mm` → `yyyy-MM-ddTHH:mm` (formato aceito pelo back-end, sem timezone). */
  private combinarDataHora(data: string | null, hora: string | null): string | undefined {
    if (!data || !PADRAO_DATA_BR.test(data)) {
      return undefined;
    }
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}T${hora || '00:00'}`;
  }

  /** `yyyy-MM-ddTHH:mm[:ss]` (resposta da API) → `{ data: 'dd/MM/yyyy', hora: 'HH:mm' }` para preencher o formulário. */
  private separarDataHora(isoDataHora: string | null | undefined): { data: string | null; hora: string | null } {
    if (!isoDataHora) {
      return { data: null, hora: null };
    }
    const [dataParte, horaParte] = isoDataHora.split('T');
    const [ano, mes, dia] = dataParte.split('-');
    return { data: `${dia}/${mes}/${ano}`, hora: horaParte ? horaParte.slice(0, 5) : null };
  }
}
