package br.com.garra.domain.dto;

import br.com.garra.domain.enums.UserRole;

public record RegisterG (String login, String senha, UserRole role) {
}
