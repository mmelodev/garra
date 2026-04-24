package br.com.garra.controller;

import br.com.garra.dto.DadosAtualizarProfessor;
import br.com.garra.dto.DadosListagemAluno;
import br.com.garra.dto.DadosListagemProfessor;
import br.com.garra.dto.DadosProfessorG;
import br.com.garra.entity.Professor;
import br.com.garra.model.DadosProfessor;
import br.com.garra.repository.ProfessorRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
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

    @GetMapping
    public Page<DadosListagemProfessor> listarProfessorsAtivos (@PageableDefault (size = 10, sort = {"nome"}) Pageable p){
        return repository.findAllByAtivoTrue(p).map(DadosListagemProfessor::new);
    }

    @GetMapping("/{id}/infoG")
    public DadosProfessorG listarProfessoresInfoGeral(@PathVariable Long id){
        Professor professor = repository.findById(id).orElseThrow(RuntimeException::new);

        return new DadosProfessorG(professor);
    }

    @PutMapping
    @Transactional
    public void atualizarCadastroProfesor(@RequestBody @Valid DadosAtualizarProfessor dados){
        Professor professor = repository.findById(dados.id()).orElseThrow(RuntimeException::new);
        professor.atualizarCadastroProfessor(dados);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void inativarAluno(@PathVariable Long id){
        Professor professor = repository.findById(id).orElseThrow(RuntimeException::new);
        professor.inativarProfessor();
    }
}
