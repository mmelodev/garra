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
  data?: string;
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
