import type {
  FinanceiroEntradaCategoria,
  FinanceiroSaidaCategoria,
  StatusMensalidade,
  TipoFinanceiroSaida,
} from './enums.model';
import type { Usuario } from './usuario.model';

export interface FinanceiroConta {
  id: number;
  saldo: number;
  data: string;
  usuario?: Usuario;
}

export interface DadosContaG {
  id: number;
  saldo: number;
  dataCriacaoConta: string;
  usuarioId: number;
}

export interface FinanceiroEntrada {
  id: number;
  valor: number;
  data: string;
  dataVencimento?: string | null;
  dataEvento?: string | null;
  dataFimEvento?: string | null;
  descricao?: string | null;
  categoria: FinanceiroEntradaCategoria;
  statusMensalidade?: StatusMensalidade | null;
}

export interface DadosFinanceiroEntradaG {
  id: number;
  valor: number;
  data: string;
  dataVencimento?: string | null;
  dataEvento?: string | null;
  dataFimEvento?: string | null;
  descricao?: string | null;
  categoria: FinanceiroEntradaCategoria;
  statusMensalidade?: StatusMensalidade | null;
  alunoId?: number | null;
  contaId: number;
}

export interface DadosListagemEntradas {
  id: number;
  valor: number;
  alunoId?: number | null;
  contaId: number;
  data: string;
  dataEvento?: string | null;
  dataFimEvento?: string | null;
  dataVencimento?: string | null;
  descricao?: string | null;
  categoria: FinanceiroEntradaCategoria;
  statusMensalidade?: StatusMensalidade | null;
}

export interface DadosFinanceiroEntrada {
  /** @DecimalMin(0.01) @DecimalMax(9999999.99) @Digits(integer=10, fraction=2) no back-end. */
  valor: number;
  alunoId?: number | null;
  conta?: FinanceiroConta;
  /**
   * Propositalmente omitido: o front não envia `data` no POST — enviar `null`
   * é tratado automaticamente pela API (mesmo padrão de `DadosFinanceiroConta.data`,
   * default `now()` quando nulo). Continua presente nos DTOs de resposta
   * (`DadosFinanceiroEntradaG`/`DadosListagemEntradas`), só não é um campo
   * editável no formulário de criação/edição.
   */
  dataEvento?: string;
  dataFimEvento?: string;
  /** Obrigatório em runtime quando categoria = MENSALIDADE (ValidacaoMensalidade). */
  dataVencimento?: string;
  descricao?: string;
  categoria: FinanceiroEntradaCategoria;
  /** Default PENDENTE quando categoria = MENSALIDADE e valor não informado. */
  statusMensalidade?: StatusMensalidade;
}

export interface FinanceiroSaida {
  id: number;
  valor: number;
  data: string;
  descricao?: string | null;
  categoria: FinanceiroSaidaCategoria;
  tipoFinanceiroSaida: TipoFinanceiroSaida;
}

export interface DadosFinanceiroSaidaG {
  id: number;
  valor: number;
  data: string;
  descricao?: string | null;
  categoria: FinanceiroSaidaCategoria;
  tipoFinanceiroSaida: TipoFinanceiroSaida;
}

export interface DadosListagemSaida {
  id: number;
  valor: number;
  contaId: number;
  data: string;
  descricao?: string | null;
  categoria: FinanceiroSaidaCategoria;
  tipoFinanceiroSaida: TipoFinanceiroSaida;
}

export interface DadosFinanceiroSaida {
  valor: number;
  contaId?: number;
  data: string;
  descricao?: string;
  categoria: FinanceiroSaidaCategoria;
  tipoFinanceiroSaida: TipoFinanceiroSaida;
}

export interface DadosFinanceiroConta {
  saldo: number;
  data?: string;
  usuario?: Usuario;
}

/**
 * ⚠️ O back-end NÃO expõe PUT /financeiro/entradas hoje (ver backend-api.md) —
 * este DTO é uma suposição do front, espelhando o contrato de
 * `DadosAtualizarProfessor`/`DadosAtualizarAluno` (corpo com `id`, sem path
 * param), até o endpoint real existir.
 */
export interface DadosAtualizarFinanceiroEntrada {
  id: number;
  valor?: number;
  alunoId?: number | null;
  dataEvento?: string;
  dataFimEvento?: string;
  dataVencimento?: string;
  descricao?: string;
  categoria?: FinanceiroEntradaCategoria;
  statusMensalidade?: StatusMensalidade;
}

export const ROTULOS_CATEGORIA_SAIDA: Record<FinanceiroSaidaCategoria, string> = {
  ALUGUEL: 'Aluguel',
  MATERIAL: 'Material',
  MARKETING: 'Marketing',
  MANUTENCAO: 'Manutenção',
  IMPOSTOS: 'Impostos',
  OUTROS: 'Outros',
};

export const ROTULOS_CATEGORIA_ENTRADA: Record<FinanceiroEntradaCategoria, string> = {
  MENSALIDADE: 'Mensalidade',
  MATRICULA: 'Matrícula',
  MATERIAL_DIDATICO: 'Material Didático',
  EVENTO: 'Evento',
  DOACAO: 'Doação',
  OUTROS: 'Outros',
};

export const ROTULOS_TIPO_FINANCEIRO_SAIDA: Record<TipoFinanceiroSaida, string> = {
  FIXA: 'Fixa',
  VARIAVEL: 'Variável',
};
