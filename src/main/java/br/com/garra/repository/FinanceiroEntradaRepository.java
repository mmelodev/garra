package br.com.garra.repository;

import br.com.garra.domain.entity.FinanceiroEntrada;
import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface FinanceiroEntradaRepository extends JpaRepository<FinanceiroEntrada, Long> {
    boolean existsByAlunoIdAndDataBetween(Long alunoId, LocalDateTime primeiro, LocalDateTime segundo);
}
