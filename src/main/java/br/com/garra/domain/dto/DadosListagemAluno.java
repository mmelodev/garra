package br.com.garra.domain.dto;

import br.com.garra.domain.entity.Aluno;
import br.com.garra.domain.entity.Professor;

public record DadosListagemAluno (Long id, String nome, Professor professorId, String endereco, String email, String whasapp) {
    public DadosListagemAluno(Aluno aluno){
        this(aluno.getId(), aluno.getNome(), aluno.getProfessor(), aluno.getEndereco(), aluno.getEmail(), aluno.getWhatsapp());
    }
}