package br.com.garra.domain.model;

import br.com.garra.domain.entity.Usuario;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DadosFinanceiroConta (double saldo, LocalDateTime data, Usuario usuario) {
    public DadosFinanceiroConta {
        if(data == null){
            data = LocalDateTime.now();
        }
    }
}
