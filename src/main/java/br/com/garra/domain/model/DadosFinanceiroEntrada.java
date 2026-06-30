package br.com.garra.domain.model;

import br.com.garra.domain.entity.FinanceiroConta;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.StatusMensalidade;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosFinanceiroEntrada (@NotNull double valor, Long alunoId, FinanceiroConta conta, @NotNull LocalDateTime data, @NotNull LocalDateTime dataVencimento, @NotNull String descricao, @NotNull FinanceiroEntradaCategoria categoria, StatusMensalidade statusMensalidade){
    public DadosFinanceiroEntrada {
        if(statusMensalidade == null){
            statusMensalidade = StatusMensalidade.PENDENTE;
        }
    }
}
