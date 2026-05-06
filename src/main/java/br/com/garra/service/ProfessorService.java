package br.com.garra.service;

import br.com.garra.domain.dto.DadosProfessorG;
import br.com.garra.domain.enums.AreaConhecimento;
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
}
