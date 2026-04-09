package br.com.garra.controller;

import br.com.garra.entity.Aluno;
import br.com.garra.model.DadosAluno;
import br.com.garra.repository.AlunoRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/aluno")
public class AlunoController {

    @Autowired
    private AlunoRepository repository;

    @PostMapping
    @Transactional
    public void cadastroAluno(@RequestBody @Valid DadosAluno dados){
        repository.save(new Aluno(dados));
    }
}
