package br.com.garra.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserRole {
    ADMIN("admin"),
    USER("user");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    @JsonCreator
    public static UserRole fromString (String texto){
        for (UserRole userRole : UserRole.values()){
            if(userRole.role.equalsIgnoreCase(texto) || userRole.name().equalsIgnoreCase(texto)){
                return userRole;
            }
        }
        throw new IllegalArgumentException("Nenhuma área de conhecimento encontrada nessa pesquisa.");
    }
}
