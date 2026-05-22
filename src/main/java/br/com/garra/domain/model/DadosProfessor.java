package br.com.garra.domain.model;

import br.com.garra.domain.enums.AreaConhecimento;
import jakarta.validation.constraints.NotBlank;
import org.antlr.v4.runtime.misc.NotNull;

public record DadosProfessor (@NotNull Long id, @NotBlank String nome, @NotNull AreaConhecimento areaConhecimento, String genero, String dataNascimento, @NotBlank String rg, @NotBlank String cpf, @NotBlank String email, @NotBlank String whatsapp, @NotBlank String dataDeEntrada, String dataDeSaida, String descricao){
    @Override
    public String toString() {
        return "DadosProfessor{" +
                "nome='" + nome + '\'' +
                ", areaConhecimento=" + areaConhecimento +
                ", genero='" + genero + '\'' +
                ", dataNascimento='" + dataNascimento + '\'' +
                ", rg='" + rg + '\'' +
                ", cpf='" + cpf + '\'' +
                ", email='" + email + '\'' +
                ", whatsapp='" + whatsapp + '\'' +
                ", dataDeEntrada='" + dataDeEntrada + '\'' +
                ", dataDeSaida='" + dataDeSaida + '\'' +
                ", descricao='" + descricao + '\'' +
                '}';
    }
}
