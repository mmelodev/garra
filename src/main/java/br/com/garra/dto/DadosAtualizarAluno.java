package br.com.garra.dto;

import br.com.garra.entity.Professor;
import org.antlr.v4.runtime.misc.NotNull;

public record DadosAtualizarAluno(@NotNull Long id, String nome, Professor professor, String email, String whatsapp, String endereco)
{
}
