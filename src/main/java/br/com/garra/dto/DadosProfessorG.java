package br.com.garra.dto;

import br.com.garra.entity.Professor;
import br.com.garra.enums.AreaConhecimento;
import jakarta.validation.constraints.NotBlank;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

public record DadosProfessorG (Long id, String nome, AreaConhecimento areaConhecimento, String genero, LocalDate dataNascimento, String rg, String cpf, String email, String whatsapp, LocalDate dataDeEntrada, LocalDate dataDeSaida, String descricao) {
    public DadosProfessorG(Professor professor){
        this(professor.getId(), professor.getNome(), professor.getAreaConhecimento(), professor.getGenero(), professor.getDataNascimento(), professor.getRg(), professor.getCpf(), professor.getEmail(), professor.getWhatsapp(), professor.getDataDeEntrada(), professor.getDataDeSaida(), professor.getDescricao());
    }
}
