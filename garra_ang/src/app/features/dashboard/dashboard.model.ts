import type {
  DadosListagemEntradas,
  DadosListagemSaida,
  FinanceiroSaidaCategoria,
  StatusMensalidade,
} from '@models';

export interface DashboardVariacao {
  readonly valor: number;
  /** Quando `true`, um valor positivo é desfavorável (ex.: alta em despesas). */
  readonly invertido?: boolean;
}

export interface DashboardResumo {
  readonly saldoAtual: number;
  readonly economias: number;
  readonly receitas: number;
  readonly despesas: number;
  readonly variacaoSaldoAtual: DashboardVariacao;
  readonly variacaoEconomias: DashboardVariacao;
  readonly variacaoReceitas: DashboardVariacao;
  readonly variacaoDespesas: DashboardVariacao;
}

/** Granularidade de agrupamento do gráfico de Fluxo de Caixa, com base em `data`. */
export type DashboardFluxoGranularidade = 'semana' | 'mes' | 'ano';

export interface DashboardFluxoPeriodo {
  readonly rotulo: string;
  readonly receitas: number;
  readonly despesas: number;
}

/** Entradas/saídas já buscadas, antes de agrupar por período — permite recalcular o Fluxo de Caixa sem nova chamada HTTP ao trocar a granularidade. */
export interface DashboardFluxoBruto {
  readonly entradas: readonly DadosListagemEntradas[];
  readonly saidas: readonly DadosListagemSaida[];
}

export interface DashboardCategoriaDespesa {
  readonly categoria: FinanceiroSaidaCategoria;
  readonly valor: number;
}

export interface DashboardTransacaoRecente {
  /** Prefixado com o tipo (`entrada:`/`saida:`) — os IDs vêm de tabelas distintas no back-end e podem colidir. */
  readonly id: string;
  readonly descricao: string;
  readonly data: string;
  readonly valor: number;
  readonly tipo: 'entrada' | 'saida';
}

export type DashboardStatusConta = StatusMensalidade;

export interface DashboardContaProxima {
  readonly id: number;
  readonly titulo: string;
  readonly vencimento: string;
  readonly valor: number;
  readonly status: DashboardStatusConta;
}
