export type AreaConhecimento = 
    | 'MATEMATICA' 
    | 'REDAÇÃO' 
    | 'FÍSICA' 
    | 'QUÍMICA' 
    | 'PORTUGUÊS' 
    | 'LITERATURA' 
    | 'HISTÓRIA' 
    | 'GEOGRAFIA' 
    | 'BIOLOGIA';

export interface Aluno {
    id: number;
    nome: string;
    email: string;
    whatsapp: string;
    endereco: string;
    sexo?: string;
    nomeMae?: string;
    nomePai?: string;
    possuiBolsa?: string;
    dataMatricula?: string;
    rg?: string;
    cpf?: string;
    professor?: Professor;
}

export interface Professor {
    id: number;
    nome: string;
    areaConhecimento: AreaConhecimento;
    email: string;
    whatsapp: string;
    genero?: string;
    dataNascimento?: string;
    dataDeEntrada?: string;
    dataDeSaida?: string;
    descricao?: string;
}

// Define o formato padrão que o Spring Boot envia quando usa Pageable
export interface SpringPage<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

// DTOs para Cadastro
export interface DadosCadastroAluno {
    nome: string;
    sexo: string;
    endereco: string;
    email: string;
    nomeMae: string;
    nomePai: string;
    whatsapp: string;
    possuiBolsa: string;
    dataMatricula: string;
    rg: string;
    cpf: string;
    professorId?: number;
}

export interface DadosCadastroProfessor {
    nome: string;
    areaConhecimento: AreaConhecimento;
    genero: string;
    dataNascimento: string;
    rg: string;
    cpf: string;
    email: string;
    whatsapp: string;
    dataDeEntrada: string;
    dataDeSaida: string;
    descricao: string;
}

// DTOs para Atualização
export interface DadosAtualizarAluno {
    id: number;
    nome?: string;
    email?: string;
    whatsapp?: string;
    endereco?: string;
    professorId?: number;
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