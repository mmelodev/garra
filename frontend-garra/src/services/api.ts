import axios from 'axios';
import { clearSession } from '../auth/session';
import { Aluno, Professor, DadosAtualizarAluno, DadosAtualizarProfessor, DadosCadastroAluno, DadosCadastroProfessor, DadosProfessorG, SpringPage } from '../interfaces';

/** Alinhado a `br.com.garra.domain.enums.UserRole` (JSON aceita nome do enum ou string do `getRole()`). */
export type UserRole = 'ADMIN' | 'USER';

export interface TokenJWT {
  token: string;
}

export interface DadosAutenticacao {
  login: string;
  senha: string;
}

export interface RegisterPayload extends DadosAutenticacao {
  role: UserRole;
}

function resolveBaseURL(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  // Em dev, URL vazia + proxy no Vite evita CORS (frontend em outra porta que o Spring).
  if (import.meta.env.DEV) return '';
  return 'http://localhost:8080';
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);
    const status = error.response?.status;
    const url = String(error.config?.url ?? '');
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
    if (status === 401 && !isAuthRoute) {
      clearSession();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export const AlunoService = {
      getAll: (params?: { page?: number; size?: number; ativo?: boolean }) => api.get<SpringPage<Aluno>>('/aluno', { params }),
      getInfoG: (id: number) => api.get(`/aluno/${id}/infoG`),
      create: (dados: DadosCadastroAluno) => api.post('/aluno', dados),
      update: (dados: DadosAtualizarAluno) => api.put('/aluno', dados),
      delete: (id: number) => api.delete(`/aluno/${id}`),
};

export const AuthService = {
  login: (dados: DadosAutenticacao) => api.post<TokenJWT>('/auth/login', dados),
  register: (dados: RegisterPayload) => api.post<void>('/auth/register', dados),
};

export const ProfessorService = {
      getAll: (params?: { page?: number; size?: number }) => api.get<SpringPage<Professor>>('/professor', { params }),
      getInfoG: (id: number) => api.get(`/professor/${id}/infoG`),
      /** `GET /professor/area/{area}` — retorna lista JSON (não paginada). */
      getByArea: (area: string) =>
            api.get<DadosProfessorG[]>(`/professor/area/${encodeURIComponent(area)}`),
      create: (dados: DadosCadastroProfessor) => api.post('/professor', dados),
      update: (dados: DadosAtualizarProfessor) => api.put('/professor', dados),
      delete: (id: number) => api.delete(`/professor/${id}`),
};