package br.com.garra.domain.enums;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum FinanceiroSaidaCategoria {
    ALUGUEL("Aluguel"),
    MATERIAL ("Material"),
    MARKETING ("Marketing"),
    MANUTENCAO ("Manutenção"),
    IMPOSTOS ("Impostos"),
    OUTROS ("Outros");

    private String financeiroSaidaCategoria;

    FinanceiroSaidaCategoria (String financeiroCategoria){
        this.financeiroSaidaCategoria = financeiroCategoria;
    }

    @JsonCreator
    public static FinanceiroSaidaCategoria fromString (String texto){
        for (FinanceiroSaidaCategoria financeiroSaidaCategoria : FinanceiroSaidaCategoria.values()){
            if(financeiroSaidaCategoria.financeiroSaidaCategoria.equalsIgnoreCase(texto) || financeiroSaidaCategoria.name().equalsIgnoreCase(texto)){
                return financeiroSaidaCategoria;
            }
        }
        throw new IllegalArgumentException("Categoria de saída financeira não encontrada nessa pesquisa.");
    }

}
