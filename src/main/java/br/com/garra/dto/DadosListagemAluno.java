package br.com.garra.dto;

import br.com.garra.entity.Aluno;

public record DadosListagemAluno (Long id, String nome, String endereco, String email, String whasapp) {
    public DadosListagemAluno(Aluno aluno){
        this(aluno.getId(), aluno.getNome(), aluno.getEndereco(), aluno.getEmail(), aluno.getWhatsapp());
    }
}
