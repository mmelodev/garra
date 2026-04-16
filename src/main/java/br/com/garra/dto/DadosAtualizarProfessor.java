package br.com.garra.dto;

import br.com.garra.enums.AreaConhecimento;
import org.antlr.v4.runtime.misc.NotNull;

public record DadosAtualizarProfessor(@NotNull Long id, String nome, AreaConhecimento areaConhecimento, String email, String whatsapp, String dataDeSaida, String descricao) {
}
