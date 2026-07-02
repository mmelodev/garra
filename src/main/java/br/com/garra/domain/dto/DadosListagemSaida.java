package br.com.garra.domain.dto;

import br.com.garra.domain.entity.FinanceiroEntrada;
import br.com.garra.domain.entity.FinanceiroSaida;
import br.com.garra.domain.enums.FinanceiroSaidaCategoria;
import br.com.garra.domain.enums.TipoFinanceiroSaida;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosListagemSaida(Long id, double valor, Long contaId, LocalDateTime data, String descricao, FinanceiroSaidaCategoria categoria, TipoFinanceiroSaida tipoFinanceiroSaida) {
    public DadosListagemSaida (FinanceiroSaida saida){
        this(saida.getId(), saida.getValor(), saida.getConta().getId(), saida.getData(), saida.getDescricao(), saida.getCategoria(), saida.getTipoFinanceiroSaida());
    }
}
