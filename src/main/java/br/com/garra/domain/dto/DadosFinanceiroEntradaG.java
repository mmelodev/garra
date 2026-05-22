package br.com.garra.domain.dto;

import br.com.garra.domain.entity.FinanceiroEntrada;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosFinanceiroEntradaG (Long id, double valor, LocalDateTime data, String descricao, FinanceiroEntradaCategoria categoria) {
    public DadosFinanceiroEntradaG(FinanceiroEntrada entrada){
        this(entrada.getId(), entrada.getValor(), entrada.getData(), entrada.getDescricao(), entrada.getCategoria());
    }
}
