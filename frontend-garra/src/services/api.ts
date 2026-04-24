import axios from 'axios';
import { Aluno, Professor, DadosAtualizarAluno, DadosAtualizarProfessor, DadosCadastroAluno, DadosCadastroProfessor, SpringPage } from '../interfaces';

const api = axios.create({
      baseURL: 'http://localhost:8080'
});

export const AlunoService = {
      getAll: () => api.get<SpringPage<Aluno>>('/aluno'),
      getInfoG: (id: number) => api.get(`/aluno/${id}/infoG`),
      create: (dados: DadosCadastroAluno) => api.post('/aluno', dados),
      update: (dados: DadosAtualizarAluno) => api.put('/aluno', dados),
      delete: (id: number) => api.delete(`/aluno/${id}`),
};

export const ProfessorService = {
      getAll: () => api.get<SpringPage<Professor>>('/professor'),
      getInfoG: (id: number) => api.get(`/professor/${id}/infoG`),
      create: (dados: DadosCadastroProfessor) => api.post('/professor', dados),
      update: (dados: DadosAtualizarProfessor) => api.put('/professor', dados),
      delete: (id: number) => api.delete(`/professor/${id}`),
};