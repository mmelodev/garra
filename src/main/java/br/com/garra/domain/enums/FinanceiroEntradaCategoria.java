package br.com.garra.domain.enums;

import br.com.garra.domain.entity.FinanceiroEntrada;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum FinanceiroEntradaCategoria {
    MENSALIDADE ("Mensalidade"),
    MATRICULA ("Matrícula"),
    MATERIAL_DIDATICO ("Material didático"),
    EVENTO ("Evento"),
    DOACAO("Doação"),
    OUTROS("Outros");

    private String financeiroEntradaCategoria;

    FinanceiroEntradaCategoria (String financeiroCategoria){
        this.financeiroEntradaCategoria = financeiroCategoria;
    }

    @JsonCreator
    public static FinanceiroEntradaCategoria fromString (String texto){
        for (FinanceiroEntradaCategoria financeiroEntradaCategoria : FinanceiroEntradaCategoria.values()){
            if(financeiroEntradaCategoria.financeiroEntradaCategoria.equalsIgnoreCase(texto) || financeiroEntradaCategoria.name().equalsIgnoreCase(texto)){
                return financeiroEntradaCategoria;
            }
        }
        throw new IllegalArgumentException("Categoria de entrada financeira não encontrada nessa pesquisa.");
    }
}
