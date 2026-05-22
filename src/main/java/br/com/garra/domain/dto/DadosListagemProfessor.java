package br.com.garra.domain.dto;

import br.com.garra.domain.entity.Professor;
import br.com.garra.domain.enums.AreaConhecimento;

public record DadosListagemProfessor(Long id, String nome, AreaConhecimento areaConhecimento, String email, String whatsapp) {
    public DadosListagemProfessor(Professor professor){
        this(professor.getId(), professor.getNome(), professor.getAreaConhecimento(), professor.getEmail(), professor.getWhatsapp());
    }
}
