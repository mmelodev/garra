package br.com.garra.controller;

import br.com.garra.domain.dto.DadosAtualizarProfessor;
import br.com.garra.domain.dto.DadosListagemProfessor;
import br.com.garra.domain.dto.DadosProfessorG;
import br.com.garra.domain.entity.Professor;
import br.com.garra.domain.model.DadosProfessor;
import br.com.garra.repository.ProfessorRepository;
import br.com.garra.service.ProfessorService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/professor")
@SecurityRequirement(name = "bearer-key")
public class ProfessorController {

    @Autowired
    private ProfessorRepository repository;

    @Autowired
    private ProfessorService professorService;

    @PostMapping
    @Transactional
    public ResponseEntity cadastroProfessor (@RequestBody @Valid DadosProfessor dados, UriComponentsBuilder uriBuilder){
        DadosProfessorG professor = professorService.cadastroProfessor(dados);
        var uri = uriBuilder.path("professor/{id}").buildAndExpand(professor.id()).toUri();
        return ResponseEntity.created(uri).body(professor);
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemProfessor>> listarProfessorsAtivos (@PageableDefault (size = 10, sort = {"nome"}) Pageable p){
        var page = repository.findAllByAtivoTrue(p).map(DadosListagemProfessor::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}/infoG")
    public ResponseEntity listarProfessoresInfoGeral(@PathVariable Long id){
        DadosProfessorG professor = professorService.infoProfessor(id);
        return ResponseEntity.ok(professor);
    }

    @PutMapping
    @Transactional
    public ResponseEntity atualizarCadastroProfesor(@RequestBody @Valid DadosAtualizarProfessor dados){
        DadosProfessorG professor = professorService.atualizarProfessor(dados);
        return ResponseEntity.ok(professor);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity inativarProfessor(@PathVariable Long id){
        professorService.inativarProfessor(id);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/area/{area}")
    public ResponseEntity<List<DadosProfessorG>> professorPorAreaConhecimento(@PathVariable String area){
        List<DadosProfessorG> professores = professorService.professorPorAreaConhecimento(area);
        return ResponseEntity.ok(professores);
    }
}
