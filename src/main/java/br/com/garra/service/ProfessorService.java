package br.com.garra.service;

import br.com.garra.domain.dto.DadosAtualizarProfessor;
import br.com.garra.domain.dto.DadosProfessorG;
import br.com.garra.domain.entity.Professor;
import br.com.garra.domain.enums.AreaConhecimento;
import br.com.garra.domain.model.DadosAluno;
import br.com.garra.domain.model.DadosProfessor;
import br.com.garra.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository repository;

    public List<DadosProfessorG> professorPorAreaConhecimento (String areaConhecimento){
        return repository.findByAreaConhecimento(AreaConhecimento.fromString(areaConhecimento))
                .stream()
                .map(DadosProfessorG::new)
                .toList();
    }

    public DadosProfessorG cadastroProfessor (DadosProfessor dados){
        Professor professor = new Professor(dados);
        Professor professorSalvo = repository.save(professor);
        return new DadosProfessorG(professorSalvo);
    }

    public DadosProfessorG infoProfessor (Long id){
        Professor professor = repository.getReferenceById(id);
        return new DadosProfessorG (professor);
    }

    public DadosProfessorG atualizarProfessor (DadosAtualizarProfessor dados){
        Professor professor = repository.findById(dados.id()).orElseThrow(RuntimeException::new);
        professor.atualizarCadastroProfessor(dados);
        return new DadosProfessorG(professor);
    }

    public void inativarProfessor (Long id){
        Professor professor = repository.getReferenceById(id);
        professor.inativarProfessor();
    }
}
