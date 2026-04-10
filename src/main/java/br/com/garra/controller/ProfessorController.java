package br.com.garra.controller;

import br.com.garra.entity.Professor;
import br.com.garra.model.DadosProfessor;
import br.com.garra.repository.ProfessorRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/professor")
public class ProfessorController {

    @Autowired
    private ProfessorRepository repository;

    @PostMapping
    @Transactional
    public void cadastroProfessor (@RequestBody @Valid DadosProfessor dados){
        repository.save(new Professor(dados));
    }
}
