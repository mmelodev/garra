/** Nomes do enum Java `AreaConhecimento` (JSON / path — usados em `/professor/area/{area}`). */
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

/** Opções para selects e filtro (valor = path/API; label = exibição). */
export const AREA_CONHECIMENTO_OPTIONS: readonly { value: AreaConhecimento; label: string }[] = [
    { value: 'MATEMATICA', label: 'Matemática' },
    { value: 'REDACAO', label: 'Redação' },
    { value: 'FISICA', label: 'Física' },
    { value: 'QUIMICA', label: 'Química' },
    { value: 'PORTUGUES', label: 'Português' },
    { value: 'LITERATURA', label: 'Literatura' },
    { value: 'HISTORIA', label: 'História' },
    { value: 'GEOGRAFIA', label: 'Geografia' },
    { value: 'BIOLOGIA', label: 'Biologia' },
];

export function areaConhecimentoLabel(area: string | undefined | null): string {
    if (area == null || area === '') return '';
    const found = AREA_CONHECIMENTO_OPTIONS.find((o) => o.value === area);
    return found?.label ?? area;
}

/** Resposta de `GET /professor/area/{area}` (`DadosProfessorG` no backend). */
export interface DadosProfessorG {
    id: number;
    nome: string;
    areaConhecimento: AreaConhecimento;
    genero?: string;
    dataNascimento?: string;
    rg?: string;
    cpf?: string;
    email: string;
    whatsapp: string;
    dataDeEntrada?: string;
    dataDeSaida?: string;
    descricao?: string;
}

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