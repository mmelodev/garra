package br.com.garra.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TipoFinanceiroSaida {
    FIXA ("Fixa"),
    VARIAVEL ("Variável");

    private String tipoFinanceiroSaida;

    TipoFinanceiroSaida (String tipoFinanceiroSaida){
        this.tipoFinanceiroSaida = tipoFinanceiroSaida;
    }

    @JsonCreator
    public static TipoFinanceiroSaida fromString (String texto){
        for(TipoFinanceiroSaida tipoFinanceiroSaida : TipoFinanceiroSaida.values()){
            if(tipoFinanceiroSaida.tipoFinanceiroSaida.equalsIgnoreCase(texto) || tipoFinanceiroSaida.name().equalsIgnoreCase(texto)){
                return tipoFinanceiroSaida;
            }
        }
        throw new IllegalArgumentException("Nenhum tipo de sáida financeira encontrada nessa pesquisa.");
    }
}