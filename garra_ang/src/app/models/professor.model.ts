import type { AreaConhecimento } from './enums.model';

export interface Professor {
  id: number;
  ativo: boolean;
  nome: string;
  areaConhecimento: AreaConhecimento;
  genero: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  email: string;
  whatsapp: string;
  dataDeEntrada: string;
  dataDeSaida?: string | null;
  descricao?: string | null;
}

export interface DadosProfessorG {
  id: number;
  nome: string;
  areaConhecimento: AreaConhecimento;
  genero: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  email: string;
  whatsapp: string;
  dataDeEntrada: string;
  dataDeSaida?: string | null;
  descricao?: string | null;
}

export interface DadosListagemProfessor {
  id: number;
  nome: string;
  areaConhecimento: AreaConhecimento;
  email: string;
  whatsapp: string;
}

export interface DadosProfessor {
  // @NotNull no back-end mesmo sendo DTO de criação (POST) — possível inconsistência,
  // confirmar antes de exigir preenchimento no formulário de cadastro
  id: number;
  nome: string;
  areaConhecimento: AreaConhecimento;
  genero?: string;
  dataNascimento?: string;
  rg: string;
  cpf: string;
  email: string;
  whatsapp: string;
  dataDeEntrada: string;
  dataDeSaida?: string;
  descricao?: string;
}

export interface DadosAtualizarProfessor {
  id: number;
  nome?: string;
  areaConhecimento?: AreaConhecimento;
  email?: string;
  whatsapp?: string;
  dataDeSaida?: string;
  descricao?: string;
}
