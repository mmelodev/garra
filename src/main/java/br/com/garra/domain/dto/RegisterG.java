package br.com.garra.domain.dto;

import br.com.garra.domain.entity.FinanceiroConta;
import br.com.garra.domain.entity.Usuario;
import br.com.garra.domain.enums.UserRole;
import br.com.garra.domain.model.DadosRegistro;
import jakarta.validation.Valid;

public record RegisterG (String login, String senha, UserRole role, FinanceiroConta conta) {
    public RegisterG (Usuario usuario){
        this(usuario.getUsername(), usuario.getPassword(), usuario.getRole(), usuario.getConta());
    }
}
