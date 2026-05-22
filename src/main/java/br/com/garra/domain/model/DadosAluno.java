package br.com.garra.domain.model;

import org.antlr.v4.runtime.misc.NotNull;
import jakarta.validation.constraints.*;

public record DadosAluno(@NotBlank String nome, Long professorId, String sexo, String endereco, @NotBlank String email, String nomeMae, String nomePai, @NotBlank String whatsapp, @NotBlank String possuiBolsa, @NotBlank String dataMatricula, @NotBlank String rg, @NotBlank String cpf) {
}
