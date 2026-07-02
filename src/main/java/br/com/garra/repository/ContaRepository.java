package br.com.garra.repository;

import br.com.garra.domain.entity.FinanceiroConta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaRepository extends JpaRepository<FinanceiroConta, Long> {
    Optional<FinanceiroConta> findByUsuarioId(Long usuarioId);
}
