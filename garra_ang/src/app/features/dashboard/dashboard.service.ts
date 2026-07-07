import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, map, shareReplay } from 'rxjs';

import type { DadosListagemEntradas, DadosListagemSaida, FinanceiroSaidaCategoria } from '@models';
import { ROTULOS_CATEGORIA_ENTRADA, ROTULOS_CATEGORIA_SAIDA } from '@models';

import { FinanceiroEntradaService } from '../financeiro/financeiro-entrada.service';
import { FinanceiroSaidaService } from '../financeiro/financeiro-saida.service';
import {
  DashboardCategoriaDespesa,
  DashboardContaProxima,
  DashboardFluxoBruto,
  DashboardFluxoGranularidade,
  DashboardFluxoPeriodo,
  DashboardResumo,
  DashboardTransacaoRecente,
} from './dashboard.model';

const QUANTIDADE_MESES_HISTORICO = 6;
const QUANTIDADE_SEMANAS_HISTORICO = 8;
const QUANTIDADE_ANOS_HISTORICO = 5;
const QUANTIDADE_TRANSACOES_RECENTES = 5;
const QUANTIDADE_PROXIMAS_CONTAS = 5;

/**
 * O back-end não expõe filtro por intervalo de datas nem endpoint agregado
 * (ver backend-api.md) — para montar o histórico mensal, buscamos uma página
 * grande o bastante para cobrir os últimos meses e agregamos no front. Se o
 * volume de lançamentos crescer além disso, os meses mais antigos do gráfico
 * ficam incompletos; o ideal é o back-end ganhar um endpoint de agregação ou
 * um filtro `data >= X` em `/financeiro/entradas` e `/financeiro/saidas`.
 */
const TAMANHO_PAGINA_HISTORICO = 200;

const ROTULOS_MES_ABREVIADO = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

/**
 * Extrai só a parte `yyyy-MM-dd` de uma data vinda da API (`data` de
 * `DadosListagemEntradas`/`DadosListagemSaida`, sempre `yyyy-MM-ddTHH:mm:ss[.SSSSSS]`,
 * confirmado ao vivo contra o back-end real). Usado como base de todas as
 * chaves de agrupamento — nunca `new Date(dataIso)` diretamente, pra não
 * depender de como cada engine de JS interpreta o timestamp sem timezone.
 */
function partesData(data: string): { ano: number; mes: number; dia: number } {
  const [ano, mes, dia] = data.slice(0, 10).split('-').map(Number);
  return { ano, mes, dia };
}

function formatarChaveDia(data: Date): string {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

/** Segunda-feira (local, sem hora) da semana em que a data cai. */
function inicioSemana(data: Date): Date {
  const deslocamento = (data.getDay() + 6) % 7; // dias desde a segunda-feira (0=Dom..6=Sáb -> 0=Seg..6=Dom)
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() - deslocamento);
}

function chaveSemana(data: string): string {
  const { ano, mes, dia } = partesData(data);
  return formatarChaveDia(inicioSemana(new Date(ano, mes - 1, dia)));
}

function chaveMes(data: string): string {
  return data.slice(0, 7);
}

function chaveAno(data: string): string {
  return data.slice(0, 4);
}

function ultimasSemanas(quantidade: number): readonly string[] {
  const inicioSemanaAtual = inicioSemana(new Date());
  const chaves: string[] = [];
  for (let i = quantidade - 1; i >= 0; i--) {
    const inicio = new Date(
      inicioSemanaAtual.getFullYear(),
      inicioSemanaAtual.getMonth(),
      inicioSemanaAtual.getDate() - i * 7
    );
    chaves.push(formatarChaveDia(inicio));
  }
  return chaves;
}

function ultimosMeses(quantidade: number): readonly string[] {
  const hoje = new Date();
  const chaves: string[] = [];
  for (let i = quantidade - 1; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    chaves.push(`${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`);
  }
  return chaves;
}

function ultimosAnos(quantidade: number): readonly string[] {
  const anoAtual = new Date().getFullYear();
  const chaves: string[] = [];
  for (let i = quantidade - 1; i >= 0; i--) {
    chaves.push(String(anoAtual - i));
  }
  return chaves;
}

function rotuloSemana(chave: string): string {
  const [, mes, dia] = chave.split('-');
  return `${dia}/${mes}`;
}

/** Inclui o ano (ex.: "Jul/26") para não ambiguar meses de mesmo nome em anos diferentes. */
function rotuloMes(chave: string): string {
  const [ano, mes] = chave.split('-');
  return `${ROTULOS_MES_ABREVIADO[Number(mes) - 1]}/${ano.slice(2)}`;
}

function rotuloAno(chave: string): string {
  return chave;
}

const OBTER_CHAVE_POR_GRANULARIDADE: Record<DashboardFluxoGranularidade, (data: string) => string> = {
  semana: chaveSemana,
  mes: chaveMes,
  ano: chaveAno,
};

const OBTER_ROTULO_POR_GRANULARIDADE: Record<DashboardFluxoGranularidade, (chave: string) => string> = {
  semana: rotuloSemana,
  mes: rotuloMes,
  ano: rotuloAno,
};

function ultimasChavesPorGranularidade(granularidade: DashboardFluxoGranularidade): readonly string[] {
  switch (granularidade) {
    case 'semana':
      return ultimasSemanas(QUANTIDADE_SEMANAS_HISTORICO);
    case 'mes':
      return ultimosMeses(QUANTIDADE_MESES_HISTORICO);
    case 'ano':
      return ultimosAnos(QUANTIDADE_ANOS_HISTORICO);
  }
}

function calcularVariacaoPercentual(atual: number, anterior: number): number {
  return anterior === 0 ? 0 : ((atual - anterior) / anterior) * 100;
}

function somarPorMes(
  entradas: readonly DadosListagemEntradas[],
  saidas: readonly DadosListagemSaida[],
  chaveMesAlvo: string
): { receitas: number; despesas: number } {
  return {
    receitas: entradas
      .filter((entrada) => chaveMes(entrada.data) === chaveMesAlvo)
      .reduce((soma, entrada) => soma + entrada.valor, 0),
    despesas: saidas
      .filter((saida) => chaveMes(saida.data) === chaveMesAlvo)
      .reduce((soma, saida) => soma + saida.valor, 0),
  };
}

function montarResumo(
  entradas: readonly DadosListagemEntradas[],
  saidas: readonly DadosListagemSaida[]
): DashboardResumo {
  const [chaveMesAnterior, chaveMesAtual] = ultimosMeses(2);
  const mesAtual = somarPorMes(entradas, saidas, chaveMesAtual);
  const mesAnterior = somarPorMes(entradas, saidas, chaveMesAnterior);

  // GET /financeiro/saldo não reflete a soma real dos lançamentos (bug confirmado
  // no back-end — ver backend-api.md: saldo ficou parado em 159.90 com 6 entradas
  // somando 1515.46 e nenhuma saída). Por isso o saldo corrente é somado aqui a
  // partir de todas as entradas/saídas já buscadas, em vez de confiar no endpoint.
  const saldoAtual =
    entradas.reduce((soma, entrada) => soma + entrada.valor, 0) -
    saidas.reduce((soma, saida) => soma + saida.valor, 0);
  const saldoFimMesAnterior = saldoAtual - (mesAtual.receitas - mesAtual.despesas);

  const economiasAtual = mesAtual.receitas - mesAtual.despesas;
  const economiasAnterior = mesAnterior.receitas - mesAnterior.despesas;

  return {
    saldoAtual,
    economias: economiasAtual,
    receitas: mesAtual.receitas,
    despesas: mesAtual.despesas,
    variacaoSaldoAtual: { valor: calcularVariacaoPercentual(saldoAtual, saldoFimMesAnterior) },
    variacaoEconomias: { valor: calcularVariacaoPercentual(economiasAtual, economiasAnterior) },
    variacaoReceitas: {
      valor: calcularVariacaoPercentual(mesAtual.receitas, mesAnterior.receitas),
    },
    variacaoDespesas: {
      valor: calcularVariacaoPercentual(mesAtual.despesas, mesAnterior.despesas),
      invertido: true,
    },
  };
}

/**
 * Agrupa entradas/saídas por semana, mês ou ano, sempre com base no atributo
 * `data` de cada lançamento (nunca `dataEvento`/`dataVencimento` — únicos
 * campos afetados pelo bug de rotação documentado em backend-api.md).
 */
export function agruparFluxoPorPeriodo(
  entradas: readonly DadosListagemEntradas[],
  saidas: readonly DadosListagemSaida[],
  granularidade: DashboardFluxoGranularidade
): DashboardFluxoPeriodo[] {
  const obterChave = OBTER_CHAVE_POR_GRANULARIDADE[granularidade];
  const obterRotulo = OBTER_ROTULO_POR_GRANULARIDADE[granularidade];
  const chaves = ultimasChavesPorGranularidade(granularidade);

  return chaves.map((chave) => {
    const receitas = entradas
      .filter((entrada) => obterChave(entrada.data) === chave)
      .reduce((soma, entrada) => soma + entrada.valor, 0);
    const despesas = saidas
      .filter((saida) => obterChave(saida.data) === chave)
      .reduce((soma, saida) => soma + saida.valor, 0);
    return { rotulo: obterRotulo(chave), receitas, despesas };
  });
}

function agruparDespesasPorCategoria(
  saidas: readonly DadosListagemSaida[]
): DashboardCategoriaDespesa[] {
  const [chaveMesAtual] = ultimosMeses(1);
  const totais = new Map<FinanceiroSaidaCategoria, number>();

  for (const saida of saidas) {
    if (chaveMes(saida.data) !== chaveMesAtual) {
      continue;
    }
    totais.set(saida.categoria, (totais.get(saida.categoria) ?? 0) + saida.valor);
  }

  return Array.from(totais.entries()).map(([categoria, valor]) => ({ categoria, valor }));
}

function montarTransacoesRecentes(
  entradas: readonly DadosListagemEntradas[],
  saidas: readonly DadosListagemSaida[]
): DashboardTransacaoRecente[] {
  const todas: DashboardTransacaoRecente[] = [
    ...entradas.map((entrada) => ({
      id: `entrada:${entrada.id}`,
      descricao: entrada.descricao || ROTULOS_CATEGORIA_ENTRADA[entrada.categoria],
      data: entrada.data,
      valor: entrada.valor,
      tipo: 'entrada' as const,
    })),
    ...saidas.map((saida) => ({
      id: `saida:${saida.id}`,
      descricao: saida.descricao || ROTULOS_CATEGORIA_SAIDA[saida.categoria],
      data: saida.data,
      valor: saida.valor,
      tipo: 'saida' as const,
    })),
  ];

  return todas
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0))
    .slice(0, QUANTIDADE_TRANSACOES_RECENTES);
}

function montarProximasContas(entradas: readonly DadosListagemEntradas[]): DashboardContaProxima[] {
  return entradas
    .filter(
      (entrada): entrada is DadosListagemEntradas & { dataVencimento: string } =>
        entrada.categoria === 'MENSALIDADE' &&
        !!entrada.statusMensalidade &&
        entrada.statusMensalidade !== 'PAGO' &&
        !!entrada.dataVencimento
    )
    .sort((a, b) => (a.dataVencimento < b.dataVencimento ? -1 : 1))
    .slice(0, QUANTIDADE_PROXIMAS_CONTAS)
    .map((entrada) => ({
      id: entrada.id,
      titulo: entrada.descricao || ROTULOS_CATEGORIA_ENTRADA['MENSALIDADE'],
      vencimento: entrada.dataVencimento,
      valor: entrada.valor,
      status: entrada.statusMensalidade!,
    }));
}

/**
 * Fonte de dados do dashboard financeiro, consumindo os services HTTP reais
 * (`FinanceiroEntradaService`, `FinanceiroSaidaService`). O saldo corrente é
 * calculado aqui a partir dos lançamentos, não via `FinanceiroContaService`
 * (ver `montarResumo` — `GET /financeiro/saldo` não reflete a soma real).
 * Provido a nível de rota (ver dashboard.routes.ts, não `providedIn: 'root'`):
 * cada visita a /dashboard busca dados novos, em vez de manter uma resposta
 * antiga em cache pelo resto da sessão do usuário.
 */
@Injectable()
export class DashboardService {
  private readonly financeiroEntradaService = inject(FinanceiroEntradaService);
  private readonly financeiroSaidaService = inject(FinanceiroSaidaService);

  private readonly entradas$ = this.financeiroEntradaService
    .getAll({ size: TAMANHO_PAGINA_HISTORICO, sort: 'data,desc' })
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly saidas$ = this.financeiroSaidaService
    .getAll({ size: TAMANHO_PAGINA_HISTORICO, sort: 'data,desc' })
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  getResumo(): Observable<DashboardResumo> {
    return combineLatest([this.entradas$, this.saidas$]).pipe(
      map(([entradas, saidas]) => montarResumo(entradas, saidas))
    );
  }

  /**
   * Retorna as entradas/saídas já buscadas (sem agrupar) — o componente
   * do gráfico chama `agruparFluxoPorPeriodo` com a granularidade escolhida
   * pelo usuário (semana/mês/ano) a cada troca, sem precisar de uma nova
   * requisição HTTP (`entradas$`/`saidas$` já são `shareReplay`).
   */
  getFluxoBruto(): Observable<DashboardFluxoBruto> {
    return combineLatest([this.entradas$, this.saidas$]).pipe(
      map(([entradas, saidas]) => ({ entradas, saidas }))
    );
  }

  getDespesasPorCategoria(): Observable<readonly DashboardCategoriaDespesa[]> {
    return this.saidas$.pipe(map((saidas) => agruparDespesasPorCategoria(saidas)));
  }

  getTransacoesRecentes(): Observable<readonly DashboardTransacaoRecente[]> {
    return combineLatest([this.entradas$, this.saidas$]).pipe(
      map(([entradas, saidas]) => montarTransacoesRecentes(entradas, saidas))
    );
  }

  getProximasContas(): Observable<readonly DashboardContaProxima[]> {
    return this.entradas$.pipe(map((entradas) => montarProximasContas(entradas)));
  }
}
