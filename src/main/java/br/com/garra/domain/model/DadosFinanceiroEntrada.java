package br.com.garra.domain.model;

import br.com.garra.domain.entity.FinanceiroConta;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.StatusMensalidade;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

public record DadosFinanceiroEntrada (@NotNull @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero") @DecimalMax(value = "9999999.99", message = "Valor máximo permitido") @Digits(integer = 10, fraction = 2, message = "Valor deve ter no máximo 2 casas decimais") double valor, Long alunoId, FinanceiroConta conta, LocalDateTime data, LocalDateTime dataEvento, LocalDateTime dataFimEvento, LocalDateTime dataVencimento, String descricao, @NotNull FinanceiroEntradaCategoria categoria, StatusMensalidade statusMensalidade){
    public DadosFinanceiroEntrada {
        if(categoria == FinanceiroEntradaCategoria.MENSALIDADE && statusMensalidade == null){
            statusMensalidade = StatusMensalidade.PENDENTE;
        }
    }
}
