package br.com.garra.service;

import br.com.garra.domain.dto.DadosAlunoG;
import br.com.garra.domain.entity.Aluno;
import br.com.garra.domain.entity.Professor;
import br.com.garra.domain.model.DadosAluno;
import br.com.garra.repository.AlunoRepository;
import br.com.garra.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlunoService {

    @Autowired
    public ProfessorRepository professorRepository;
    @Autowired
    public AlunoRepository alunoRepository;

    public DadosAlunoG cadastroAluno (DadosAluno dados){
        Professor professor = professorRepository.getReferenceById(dados.professorId());
        Aluno aluno = new Aluno((dados));
        aluno.setProfessor(professor);
        Aluno alunoSalvo = alunoRepository.save(aluno);
        return new DadosAlunoG(alunoSalvo);
    }
}
