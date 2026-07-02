package br.com.garra.domain.dto;

import br.com.garra.domain.entity.FinanceiroConta;
import br.com.garra.domain.entity.Usuario;

import java.time.LocalDateTime;

public record DadosContaG (Long id, double saldo, LocalDateTime dataCriacaoConta, Long usuarioId) {
    public DadosContaG(FinanceiroConta conta){
        this(conta.getId(), conta.getSaldo() , conta.getData(), conta.getUsuario().getId());
    }
}
