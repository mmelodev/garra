package br.com.garra.domain.dto;

import br.com.garra.domain.entity.FinanceiroEntrada;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.StatusMensalidade;
import jakarta.validation.constraints.NotNull;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

public record DadosFinanceiroEntradaG (Long id, double valor, LocalDateTime data, LocalDateTime dataVencimento, String descricao, FinanceiroEntradaCategoria categoria, StatusMensalidade statusMensalidade) {
    public DadosFinanceiroEntradaG(FinanceiroEntrada entrada){
        this(entrada.getId(), entrada.getValor(), entrada.getData(), entrada.getDataVencimento(), entrada.getDescricao(), entrada.getCategoria(), entrada.getStatusMensalidade());
    }
}
