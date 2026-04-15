package br.com.garra.repository;

import br.com.garra.entity.Professor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    //metodos
    Page<Professor> findAllByAtivoTrue(Pageable p);
}
