package br.com.garra.dto;

import br.com.garra.entity.Aluno;
import org.antlr.v4.runtime.misc.NotNull;

public record DadosAtualizarAluno(@NotNull Long id, String nome, String email, String whatsapp, String endereco)
{
}
