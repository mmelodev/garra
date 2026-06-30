package br.com.garra.domain.model;

import br.com.garra.domain.entity.FinanceiroConta;
import br.com.garra.domain.entity.Usuario;
import br.com.garra.domain.enums.UserRole;
import jakarta.validation.constraints.NotNull;

public record DadosRegistro (@NotNull String login, @NotNull String senha, UserRole role, FinanceiroConta conta) {
    public DadosRegistro {
        if (role == null){
            role = UserRole.USER;
        }
    }
}
