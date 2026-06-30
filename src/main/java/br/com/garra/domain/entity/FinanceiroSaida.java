package br.com.garra.domain.entity;

import br.com.garra.domain.enums.FinanceiroSaidaCategoria;
import br.com.garra.domain.enums.TipoFinanceiroSaida;
import br.com.garra.domain.model.DadosFinanceiroSaida;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity(name = "FinanceiroSaida")
@Table(name = "financeiro_saida")
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class FinanceiroSaida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double valor;
    private LocalDateTime data;
    private String descricao;
    @Enumerated(EnumType.STRING)
    private FinanceiroSaidaCategoria categoria;
    @Enumerated(EnumType.STRING)
    private TipoFinanceiroSaida tipoFinanceiroSaida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private FinanceiroConta conta;

    public FinanceiroSaida(){}

    public FinanceiroSaida (DadosFinanceiroSaida saida){
        this.valor = saida.valor();
        this.data = saida.data();
        this.descricao = saida.descricao();
        this.categoria = saida.categoria();
        this.tipoFinanceiroSaida = saida.tipoFinanceiroSaida();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FinanceiroConta getConta() {
        return conta;
    }

    public void setConta(FinanceiroConta conta) {
        this.conta = conta;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public FinanceiroSaidaCategoria getCategoria() {
        return categoria;
    }

    public void setCategoria(FinanceiroSaidaCategoria categoria) {
        this.categoria = categoria;
    }

    public TipoFinanceiroSaida getTipoFinanceiroSaida() {
        return tipoFinanceiroSaida;
    }

    public void setTipoFinanceiroSaida(TipoFinanceiroSaida tipoFinanceiroSaida) {
        this.tipoFinanceiroSaida = tipoFinanceiroSaida;
    }
}
