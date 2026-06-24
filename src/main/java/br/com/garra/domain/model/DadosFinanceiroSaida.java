package br.com.garra.domain.model;

import br.com.garra.domain.enums.FinanceiroSaidaCategoria;
import br.com.garra.domain.enums.TipoFinanceiroSaida;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosFinanceiroSaida(@NotNull double valor, @NotNull LocalDateTime data, String descricao, @NotNull FinanceiroSaidaCategoria categoria, @NotNull TipoFinanceiroSaida tipoFinanceiroSaida) {

}
