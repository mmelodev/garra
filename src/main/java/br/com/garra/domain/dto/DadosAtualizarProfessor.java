package br.com.garra.domain.dto;

import br.com.garra.domain.enums.AreaConhecimento;
import org.antlr.v4.runtime.misc.NotNull;

public record DadosAtualizarProfessor(@NotNull Long id, String nome, AreaConhecimento areaConhecimento, String email, String whatsapp, String dataDeSaida, String descricao) {
}
