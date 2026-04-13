package br.com.garra.repository;

import br.com.garra.entity.Aluno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    //metodos

    Page<Aluno> findAllByAtivoTrue(Pageable paginacao);
}
