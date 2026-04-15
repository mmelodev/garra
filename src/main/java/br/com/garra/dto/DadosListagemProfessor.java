package br.com.garra.dto;

import br.com.garra.entity.Professor;
import br.com.garra.enums.AreaConhecimento;

public record DadosListagemProfessor(Long id, String nome, AreaConhecimento areaConhecimento, String email, String whatsapp) {
    public DadosListagemProfessor(Professor professor){
        this(professor.getId(), professor.getNome(), professor.getAreaConhecimento(), professor.getEmail(), professor.getWhatsapp());
    }
}
