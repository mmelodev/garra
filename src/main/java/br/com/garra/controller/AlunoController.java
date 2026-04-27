package br.com.garra.controller;

import br.com.garra.dto.DadosAlunoG;
import br.com.garra.dto.DadosAtualizarAluno;
import br.com.garra.dto.DadosListagemAluno;
import br.com.garra.entity.Aluno;
import br.com.garra.entity.Professor;
import br.com.garra.model.DadosAluno;
import br.com.garra.repository.AlunoRepository;
import br.com.garra.repository.ProfessorRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/aluno")
public class AlunoController {

    @Autowired
    private AlunoRepository repository;
    @Autowired
    private ProfessorRepository professorRepository;

    @PostMapping
    @Transactional
    public void cadastroAluno(@RequestBody @Valid DadosAluno dados){
        Professor professor = professorRepository.getReferenceById(dados.professorId());
        Aluno aluno = new Aluno(dados);
        aluno.setProfessor(professor);
        repository.save(aluno);
    }

    @GetMapping
    public Page<DadosListagemAluno> listaAlunos (@PageableDefault (size = 10, sort = { "nome" }) Pageable paginacao){
        return repository.findAllByAtivoTrue(paginacao).map(DadosListagemAluno::new);
    }

    @GetMapping("/{id}/infoG")
    public DadosAlunoG listaAlunoInfoCompleta(@PathVariable Long id){
        Aluno aluno = repository.findById(id).orElseThrow(() -> new RuntimeException());
        return new DadosAlunoG(aluno);
    }

    @PutMapping
    @Transactional
    public void atualizarCadastroAluno(@RequestBody @Valid DadosAtualizarAluno dados){
        Aluno aluno = repository.findById(dados.id()).orElseThrow(() -> new RuntimeException());
        aluno.atualizarCadastroAluno(dados);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void inativarAluno (@PathVariable Long id){
        Aluno aluno = repository.findById(id).orElseThrow(() -> new RuntimeException());
        aluno.inativarAluno();
    }
}
