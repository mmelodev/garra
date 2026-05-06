package br.com.garra.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum AreaConhecimento {
    MATEMATICA("Matemática"),
    REDACAO("Redação"),
    FISICA("Física"),
    QUIMICA("Química"),
    PORTUGUES("Português"),
    LITERATURA("Literatura"),
    HISTORIA("História"),
    GEOGRAFIA("Geografia"),
    BIOLOGIA("Biologia");

    private String areaConhecimento;

    AreaConhecimento (String areaConhecimento){
        this.areaConhecimento = areaConhecimento;
    }

    @JsonCreator
    public static AreaConhecimento fromString (String texto){
        for (AreaConhecimento areaConhecimento : AreaConhecimento.values()){
            if(areaConhecimento.areaConhecimento.equalsIgnoreCase(texto) || areaConhecimento.name().equalsIgnoreCase(texto)){
                return areaConhecimento;
            }
        }
        throw new IllegalArgumentException("Nenhuma área de conhecimento encontrada nessa pesquisa.");
    }
}
