package br.com.garra.repository;

import br.com.garra.domain.entity.FinanceiroConta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContaRepository extends JpaRepository<FinanceiroConta, Long> {
}
