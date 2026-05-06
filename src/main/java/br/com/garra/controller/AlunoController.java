package br.com.garra.controller;

import br.com.garra.domain.dto.DadosAlunoG;
import br.com.garra.domain.dto.DadosAtualizarAluno;
import br.com.garra.domain.dto.DadosListagemAluno;
import br.com.garra.domain.dto.DadosProfessorG;
import br.com.garra.domain.entity.*;
import br.com.garra.domain.model.DadosAluno;
import br.com.garra.repository.AlunoRepository;
import br.com.garra.repository.ProfessorRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

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
    public ResponseEntity cadastroAluno(@RequestBody @Valid DadosAluno dados, UriComponentsBuilder uriBuilder){
        var aluno = new Aluno(dados);
        repository.save(aluno);
        Professor professor = professorRepository.getReferenceById(dados.professorId());
        aluno.setProfessor(professor);
        var uri = uriBuilder.path("/aluno/{id}").buildAndExpand(aluno.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosAlunoG(aluno));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemAluno>> listaAlunos (@PageableDefault (size = 10, sort = { "nome" }) Pageable paginacao){
        var page = repository.findAllByAtivoTrue(paginacao).map(DadosListagemAluno::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}/infoG")
    public ResponseEntity listaAlunoInfoCompleta(@PathVariable Long id){
        Aluno aluno = repository.getReferenceById(id);
        return ResponseEntity.ok(new DadosAlunoG(aluno));
    }

    @PutMapping
    @Transactional
    public ResponseEntity atualizarCadastroAluno(@RequestBody @Valid DadosAtualizarAluno dados){
        Aluno aluno = repository.findById(dados.id()).orElseThrow(() -> new RuntimeException());
        aluno.atualizarCadastroAluno(dados);
        return ResponseEntity.ok(new DadosAlunoG(aluno));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity inativarAluno (@PathVariable Long id){
        Aluno aluno = repository.findById(id).orElseThrow(() -> new RuntimeException());
        aluno.inativarAluno();
        return ResponseEntity.notFound().build();
    }
}
