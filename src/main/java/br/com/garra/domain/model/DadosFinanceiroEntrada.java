package br.com.garra.domain.model;

import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosFinanceiroEntrada (@NotNull double valor, Long alunoId, @NotNull LocalDateTime data, @NotNull String descricao, @NotNull FinanceiroEntradaCategoria categoria){
}
