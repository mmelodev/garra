import type { UserRole } from './enums.model';
import type { FinanceiroConta } from './financeiro.model';

export interface Usuario {
  id: number;
  login: string;
  senha: string;
  role: UserRole;
  conta?: FinanceiroConta;
}

export interface DadosAutenticacao {
  login: string;
  senha: string;
}

export interface DadosRegistro {
  login: string;
  senha: string;
  role?: UserRole;
  conta?: FinanceiroConta;
}

export interface RegisterG {
  login: string;
  /** Atenção: expõe a senha na resposta — risco de segurança, avaliar remoção no back-end. */
  senha: string;
  role: UserRole;
  conta: FinanceiroConta;
}

export interface TokenJWT {
  token: string;
}
