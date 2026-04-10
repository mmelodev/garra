package br.com.garra.repository;

import br.com.garra.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    //metodos
}
