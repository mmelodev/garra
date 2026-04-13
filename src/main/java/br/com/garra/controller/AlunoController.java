package br.com.garra.controller;

import br.com.garra.dto.DadosListagemAluno;
import br.com.garra.entity.Aluno;
import br.com.garra.model.DadosAluno;
import br.com.garra.repository.AlunoRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public Page<DadosListagemAluno> listaAlunos (@PageableDefault (size = 10, sort = { "nome" }) Pageable paginacao){
        return repository.findAllByAtivoTrue(paginacao).map(DadosListagemAluno::new);
    }
}
