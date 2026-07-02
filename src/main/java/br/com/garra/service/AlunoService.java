package br.com.garra.service;

import br.com.garra.domain.dto.DadosAlunoG;
import br.com.garra.domain.dto.DadosAtualizarAluno;
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
        Aluno aluno = new Aluno(dados);
        aluno.setProfessor(professor);
        Aluno alunoSalvo = alunoRepository.save(aluno);
        return new DadosAlunoG(alunoSalvo);
    }

    public DadosAlunoG infoAluno (Long id){
        Aluno aluno = alunoRepository.getReferenceById(id);
        return new DadosAlunoG(aluno);
    }

    public DadosAlunoG atualizarAluno (DadosAtualizarAluno dados){
        Aluno aluno = alunoRepository.findById(dados.id()).orElseThrow(() -> new RuntimeException());
        aluno.atualizarCadastroAluno(dados);
        return new DadosAlunoG(aluno);
    }

    public void inativarAluno(Long id){
        Aluno aluno = alunoRepository.findById(id).orElseThrow(() -> new RuntimeException());
        aluno.inativarAluno();
    }
}
