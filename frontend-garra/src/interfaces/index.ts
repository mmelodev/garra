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
    ativo?: boolean;
    nome: string;
    email: string;
    whatsapp: string;
    whasapp?: string; // Para compatibilidade com o DTO DadosListagemAluno
    endereco: string;
    sexo?: string;
    nomeMae?: string;
    nomePai?: string;
    possuiBolsa?: string | boolean;
    dataMatricula?: string;
    rg?: string;
    cpf?: string;
    professor?: Professor;
    professorId?: Professor; // O DTO DadosListagemAluno envia o objeto Professor aqui
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
    professorId?: number;
    email: string;
    whatsapp: string;
    cpf: string;
    rg: string;
    dataMatricula: string;
    possuiBolsa: string;
    sexo?: string;
    endereco?: string;
    nomeMae?: string;
    nomePai?: string;
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