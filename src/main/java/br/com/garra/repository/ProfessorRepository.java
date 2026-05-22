package br.com.garra.repository;

import br.com.garra.domain.entity.Professor;
import br.com.garra.domain.enums.AreaConhecimento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    //metodos
    Page<Professor> findAllByAtivoTrue(Pageable p);

    List<Professor> findByAreaConhecimento(AreaConhecimento areaConhecimento);
}
