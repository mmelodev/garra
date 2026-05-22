package br.com.garra.domain.dto;

import br.com.garra.domain.entity.Professor;
import org.antlr.v4.runtime.misc.NotNull;

public record DadosAtualizarAluno(Long id, String nome, Professor professor, String email, String whatsapp, String endereco)
{
}
