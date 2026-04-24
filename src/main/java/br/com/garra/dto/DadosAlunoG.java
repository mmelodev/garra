package br.com.garra.dto;

import br.com.garra.entity.Aluno;
import br.com.garra.entity.Professor;
import jakarta.validation.constraints.NotBlank;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;

public record DadosAlunoG(Long id, String nome, Professor professor, String sexo, String endereco, String email, String nomeMae, String nomePai, String whatsapp, Boolean possuiBolsa, LocalDate dataMatricula, String rg, String cpf) {
    public DadosAlunoG(Aluno aluno){
        this(aluno.getId(), aluno.getNome(), aluno.getProfessor() , aluno.getSexo(), aluno.getEndereco(), aluno.getEmail(), aluno.getNomeMae(), aluno.getNomePai(), aluno.getWhatsapp(), aluno.getPossuiBolsa(), aluno.getDataMatricula(), aluno.getRg(), aluno.getCpf());
    }
}
