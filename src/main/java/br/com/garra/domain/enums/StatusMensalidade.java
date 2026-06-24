package br.com.garra.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum StatusMensalidade {
    PENDENTE ("Pendente"),
    PAGO ("Pago"),
    ATRASADO ("Atrasado");

    private String statusMensalidade;

    StatusMensalidade (String statusMensalidade){
        this.statusMensalidade = statusMensalidade;
    }

    @JsonCreator
    public static StatusMensalidade fromString (String texto){
        for (StatusMensalidade statusMensalidade : StatusMensalidade.values()){
            if (statusMensalidade.statusMensalidade.equalsIgnoreCase(texto) || statusMensalidade.name().equalsIgnoreCase(texto)){
                return statusMensalidade;
            }
        }
        throw new IllegalArgumentException("Status da mensalidade não cadastrado.");
    }
}
