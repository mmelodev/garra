package br.com.garra.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity(name = "FinanceiroConta")
@Table(name = "financeiro_conta")
@Getter
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class FinanceiroConta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double saldo;
    private LocalDateTime data;

    //pra uma conta tenho diversas entradas e saídas financeiras, adicionar relacionamento inverso também.
}
