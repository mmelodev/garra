package br.com.garra.domain.entity;

import br.com.garra.domain.model.DadosFinanceiroConta;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "FinanceiroConta")
@Table(name = "financeiro_conta")
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class FinanceiroConta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double saldo;
    private LocalDateTime data;

    @OneToMany(mappedBy = "conta",fetch = FetchType.LAZY)
    private List<FinanceiroEntrada> financeiroEntrada;

    @OneToMany(mappedBy = "conta",fetch = FetchType.LAZY)
    private List<FinanceiroSaida> financeiroSaida;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private Usuario usuario;

    public FinanceiroConta(){}

    public FinanceiroConta (DadosFinanceiroConta conta){
        this.saldo = conta.saldo();
        this.data = conta.data();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getSaldo() {
        return saldo;
    }

    public void setSaldo(double saldo) {
        this.saldo = saldo;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public List<FinanceiroEntrada> getFinanceiroEntrada() {
        return financeiroEntrada;
    }

    public void setFinanceiroEntrada(List<FinanceiroEntrada> financeiroEntrada) {
        this.financeiroEntrada = financeiroEntrada;
    }

    public List<FinanceiroSaida> getFinanceiroSaida() {
        return financeiroSaida;
    }

    public void setFinanceiroSaida(List<FinanceiroSaida> financeiroSaida) {
        this.financeiroSaida = financeiroSaida;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
