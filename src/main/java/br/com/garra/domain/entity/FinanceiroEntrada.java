package br.com.garra.domain.entity;

import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.StatusMensalidade;
import br.com.garra.domain.model.DadosFinanceiroEntrada;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "FinanceiroEntrada")
@Table(name = "financeiro_entrada")
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class FinanceiroEntrada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double valor;
    private LocalDateTime data;
    private LocalDateTime dataVencimento;
    private String descricao;
    @Enumerated(EnumType.STRING)
    private FinanceiroEntradaCategoria categoria;
    @Enumerated(EnumType.STRING)
    private StatusMensalidade statusMensalidade;

    public FinanceiroEntrada (DadosFinanceiroEntrada entrada){
        this.valor = entrada.valor();
        this.data = entrada.data();
        this.descricao = entrada.descricao();
        this.categoria = entrada.categoria();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private FinanceiroConta conta;

    public FinanceiroConta getConta() {
        return conta;
    }

    public void setConta(FinanceiroConta conta) {
        this.conta = conta;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Long getId() {
        return id;
    }

    public double getValor() {
        return valor;
    }

    public LocalDateTime getData() {
        return data;
    }

    public String getDescricao() {
        return descricao;
    }

    public FinanceiroEntradaCategoria getCategoria() {
        return categoria;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setCategoria(FinanceiroEntradaCategoria categoria) {
        this.categoria = categoria;
    }

    public StatusMensalidade getStatusMensalidade() {
        return statusMensalidade;
    }

    public void setStatusMensalidade(StatusMensalidade statusMensalidade) {
        this.statusMensalidade = statusMensalidade;
    }

    public LocalDateTime getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDateTime dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public FinanceiroEntrada() {}
}
