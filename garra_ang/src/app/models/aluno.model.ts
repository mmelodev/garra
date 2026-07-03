import type { Professor } from './professor.model';

export interface Aluno {
  id: number;
  ativo: boolean;
  nome: string;
  professor?: Professor;
  sexo: string;
  endereco: string;
  email: string;
  nomeMae?: string;
  nomePai?: string;
  whatsapp: string;
  possuiBolsa: boolean;
  dataMatricula: string;
  rg: string;
  cpf: string;
}

export interface DadosAlunoG {
  id: number;
  nome: string;
  professor: Professor;
  sexo: string;
  endereco: string;
  email: string;
  nomeMae?: string;
  nomePai?: string;
  whatsapp: string;
  possuiBolsa: boolean;
  dataMatricula: string;
  rg: string;
  cpf: string;
}

export interface DadosListagemAluno {
  id: number;
  nome: string;
  /**
   * Apesar do nome, o back-end serializa a entidade `Professor` inteira
   * aqui (inclusive um `hibernateLazyInitializer` vazio, sinal de que é a
   * entidade JPA, não um DTO) — não é um id numérico. Confirmado inspecionando
   * a resposta real de GET /aluno; backend-api.md documentava só "Professor"
   * entre parênteses, mas o nome do campo sugeria um id. Front-end deve
   * tratar como objeto.
   */
  professorId: Professor;
  endereco: string;
  email: string;
  /** Typo herdado do back-end (domain/dto/DadosListagemAluno): campo sem o "t" de "whatsapp". */
  whasapp: string;
}

export interface DadosAluno {
  nome: string;
  professorId?: number;
  sexo?: string;
  endereco?: string;
  email: string;
  nomeMae?: string;
  nomePai?: string;
  whatsapp: string;
  /** String obrigatória no request, embora a resposta (DadosAlunoG) traga possuiBolsa como boolean. */
  possuiBolsa: string;
  dataMatricula: string;
  rg: string;
  cpf: string;
}

export interface DadosAtualizarAluno {
  id: number;
  nome?: string;
  professor?: Professor;
  email?: string;
  whatsapp?: string;
  endereco?: string;
}
