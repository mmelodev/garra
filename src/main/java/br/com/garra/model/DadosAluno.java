package br.com.garra.model;

import jakarta.persistence.Column;
import org.antlr.v4.runtime.misc.NotNull;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record DadosAluno(@NotNull Long id, @NotBlank String nome, String sexo, String endereco, @NotBlank String email, String nomeMae, String nomePai, @NotBlank String whatsapp, @NotBlank String possuiBolsa, @NotBlank String dataMatricula, @NotBlank String rg, @NotBlank String cpf) {

    @Override
    public String toString() {
        return "DadosAluno{" +
                "nome='" + nome + '\'' +
                ", sexo='" + sexo + '\'' +
                ", endereco='" + endereco + '\'' +
                ", email='" + email + '\'' +
                ", nomeMae='" + nomeMae + '\'' +
                ", nomePai='" + nomePai + '\'' +
                ", whatsapp='" + whatsapp + '\'' +
                ", possuiBolsa=" + possuiBolsa +
                ", dataMatricula=" + dataMatricula +
                ", rg='" + rg + '\'' +
                ", cpf='" + cpf + '\'' +
                '}';
    }
}
