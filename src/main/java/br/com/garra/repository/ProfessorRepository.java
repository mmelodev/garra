package br.com.garra.repository;

import br.com.garra.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    //metodos
}
