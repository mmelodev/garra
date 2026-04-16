package br.com.garra.entity;

import br.com.garra.dto.DadosAtualizarProfessor;
import br.com.garra.enums.AreaConhecimento;
import br.com.garra.model.DadosProfessor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.Optional;

@Table(name = "professor")
@Entity(name = "Professor")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Boolean ativo;

    @Column(nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    private AreaConhecimento areaConhecimento;

    private String genero;

    private LocalDate dataNascimento;

    @Column(nullable = false)
    private String rg;

    @Column(nullable = false)
    private String cpf;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(nullable = false)
    private String whatsapp;

    @Column(nullable = false)
    private LocalDate dataDeEntrada;

    private LocalDate dataDeSaida;

    private String descricao;

    public Professor (){}

    public Professor (DadosProfessor prof){
        this.ativo = true;
        this.nome = prof.nome();
        this.areaConhecimento = prof.areaConhecimento();
        this.genero = prof.genero();
        this.dataNascimento = LocalDate.parse(prof.dataNascimento());
        this.rg = prof.rg();
        this.cpf = prof.cpf();
        this.email = prof.email();
        this.whatsapp = prof.whatsapp();
        this.dataDeEntrada = LocalDate.parse(prof.dataDeEntrada());
        this.dataDeSaida = Optional.ofNullable(prof.dataDeSaida()).map(LocalDate::parse).orElse(null);
        this.descricao = prof.descricao();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public AreaConhecimento getAreaConhecimento() {
        return areaConhecimento;
    }

    public void setAreaConhecimento(AreaConhecimento areaConhecimento) {
        this.areaConhecimento = areaConhecimento;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public LocalDate getDataDeEntrada() {
        return dataDeEntrada;
    }

    public void setDataDeEntrada(LocalDate dataDeEntrada) {
        this.dataDeEntrada = dataDeEntrada;
    }

    public LocalDate getDataDeSaida() {
        return dataDeSaida;
    }

    public void setDataDeSaida(LocalDate dataDeSaida) {
        this.dataDeSaida = dataDeSaida;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void atualizarCadastroProfessor (DadosAtualizarProfessor dados){
        if(dados.nome() != null){
            this.nome = dados.nome();
        }
        if (dados.areaConhecimento() != null){
            this.areaConhecimento = dados.areaConhecimento();
        }

        if(dados.email() != null){
            this.email = dados.email();
        }
        if(dados.whatsapp() != null){
            this.whatsapp = dados.whatsapp();
        }
        if(dados.dataDeSaida() != null){
            this.dataDeSaida = LocalDate.parse(dados.dataDeSaida());
        }
        if(dados.descricao() != null) {
            this.descricao = dados.descricao();
        }
    }

    public void inativarProfessor (){
        this.ativo = false;
    }
}