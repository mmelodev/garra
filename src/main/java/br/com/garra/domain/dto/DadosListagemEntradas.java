package br.com.garra.domain.dto;

import br.com.garra.domain.entity.Aluno;
import br.com.garra.domain.entity.FinanceiroConta;
import br.com.garra.domain.entity.FinanceiroEntrada;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.StatusMensalidade;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosListagemEntradas(Long id, double valor, Long alunoId, Long contaId, LocalDateTime data, LocalDateTime dataEvento, LocalDateTime dataFimEvento, LocalDateTime dataVencimento, String descricao, FinanceiroEntradaCategoria categoria, StatusMensalidade statusMensalidade) {
    public DadosListagemEntradas(FinanceiroEntrada entrada){
        this(entrada.getId(), entrada.getValor(), entrada.getAluno() != null? entrada.getAluno().getId() : null, entrada.getConta().getId(), entrada.getData(), entrada.getDataEvento(), entrada.getDataFimEvento(), entrada.getDataVencimento(), entrada.getDescricao(), entrada.getCategoria(), entrada.getStatusMensalidade());
    }
}
