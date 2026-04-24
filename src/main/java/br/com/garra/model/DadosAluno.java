package br.com.garra.model;

import br.com.garra.entity.Professor;
import org.antlr.v4.runtime.misc.NotNull;
import jakarta.validation.constraints.*;

public record DadosAluno(@NotNull Long id, @NotBlank String nome, @NotNull Professor professor, String sexo, String endereco, @NotBlank String email, String nomeMae, String nomePai, @NotBlank String whatsapp, @NotBlank String possuiBolsa, @NotBlank String dataMatricula, @NotBlank String rg, @NotBlank String cpf) {
}
