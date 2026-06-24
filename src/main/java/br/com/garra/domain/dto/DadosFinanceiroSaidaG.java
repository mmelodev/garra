package br.com.garra.domain.dto;

import br.com.garra.domain.entity.FinanceiroSaida;
import br.com.garra.domain.enums.FinanceiroSaidaCategoria;
import br.com.garra.domain.enums.TipoFinanceiroSaida;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosFinanceiroSaidaG(Long id, double valor, LocalDateTime data, String descricao, FinanceiroSaidaCategoria categoria, TipoFinanceiroSaida tipoFinanceiroSaida) {
    public DadosFinanceiroSaidaG(FinanceiroSaida saida) {
        this(saida.getId(), saida.getValor(), saida.getData(), saida.getDescricao(), saida.getCategoria(), saida.getTipoFinanceiroSaida());
    }
}
