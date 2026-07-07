export type AreaConhecimento =
  | 'MATEMATICA'
  | 'REDACAO'
  | 'FISICA'
  | 'QUIMICA'
  | 'PORTUGUES'
  | 'LITERATURA'
  | 'HISTORIA'
  | 'GEOGRAFIA'
  | 'BIOLOGIA';

export const ROTULOS_AREA_CONHECIMENTO: Record<AreaConhecimento, string> = {
  MATEMATICA: 'Matemática',
  REDACAO: 'Redação',
  FISICA: 'Física',
  QUIMICA: 'Química',
  PORTUGUES: 'Português',
  LITERATURA: 'Literatura',
  HISTORIA: 'História',
  GEOGRAFIA: 'Geografia',
  BIOLOGIA: 'Biologia',
};

export type FinanceiroEntradaCategoria =
  | 'MENSALIDADE'
  | 'MATRICULA'
  | 'MATERIAL_DIDATICO'
  | 'EVENTO'
  | 'DOACAO'
  | 'OUTROS';

export type FinanceiroSaidaCategoria =
  | 'ALUGUEL'
  | 'MATERIAL'
  | 'MARKETING'
  | 'MANUTENCAO'
  | 'IMPOSTOS'
  | 'OUTROS';

export type StatusMensalidade = 'PENDENTE' | 'PAGO' | 'ATRASADO';

export type TipoFinanceiroSaida = 'FIXA' | 'VARIAVEL';

export type UserRole = 'ADMIN' | 'USER';
