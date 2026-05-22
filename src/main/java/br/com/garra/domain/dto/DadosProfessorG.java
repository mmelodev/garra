package br.com.garra.domain.dto;

import br.com.garra.domain.entity.Professor;
import br.com.garra.domain.enums.AreaConhecimento;

import java.time.LocalDate;

public record DadosProfessorG (Long id, String nome, AreaConhecimento areaConhecimento, String genero, LocalDate dataNascimento, String rg, String cpf, String email, String whatsapp, LocalDate dataDeEntrada, LocalDate dataDeSaida, String descricao) {
    public DadosProfessorG(Professor professor){
        this(professor.getId(), professor.getNome(), professor.getAreaConhecimento(), professor.getGenero(), professor.getDataNascimento(), professor.getRg(), professor.getCpf(), professor.getEmail(), professor.getWhatsapp(), professor.getDataDeEntrada(), professor.getDataDeSaida(), professor.getDescricao());
    }
}
