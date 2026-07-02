package br.com.garra.controller;

import br.com.garra.domain.dto.*;
import br.com.garra.domain.entity.Aluno;
import br.com.garra.domain.entity.FinanceiroEntrada;
import br.com.garra.domain.model.DadosFinanceiroEntrada;
import br.com.garra.domain.model.DadosFinanceiroSaida;
import br.com.garra.exeption.ValidacaoException;
import br.com.garra.repository.AlunoRepository;
import br.com.garra.repository.FinanceiroEntradaRepository;
import br.com.garra.service.FinanceiroService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/financeiro")
public class FinanceiroController {

    @Autowired
    private FinanceiroEntradaRepository entradaRepository;
    @Autowired
    private AlunoRepository alunoRepository;
    @Autowired
    private FinanceiroService service;

    @PostMapping("/entradas")
    @Transactional
    public ResponseEntity<DadosFinanceiroEntradaG> entradas (@RequestBody @Valid DadosFinanceiroEntrada entrada, UriComponentsBuilder uriComponentsBuilder){
        DadosFinanceiroEntradaG entradaN = service.cadastrarEntrada(entrada);
        var uri = uriComponentsBuilder.path("financeiro/entradas/{id}").buildAndExpand(entradaN).toUri();
        return ResponseEntity.created(uri).body(entradaN);
    }

    @GetMapping("/entradas")
    public ResponseEntity<Page<DadosListagemEntradas>> listarEntradas (@PageableDefault (size = 10, sort = {"data"}) Pageable paginacao) {
        var page = service.listarEntradas(paginacao);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/entradas/{id}")
    public ResponseEntity infoEntrada (@PathVariable Long id){
        DadosFinanceiroEntradaG entrada = service.infoEntrada(id);
        return ResponseEntity.ok(entrada);
    }

    @PostMapping("/saidas")
    @Transactional
    public ResponseEntity<DadosFinanceiroSaidaG> saidas (@RequestBody @Valid DadosFinanceiroSaida saida, UriComponentsBuilder uriComponentsBuilder){
        DadosFinanceiroSaidaG saidaN = service.cadastrarSaida(saida);
        var uri = uriComponentsBuilder.path("financeiro/saidas/{id}").buildAndExpand(saidaN).toUri();
        return ResponseEntity.created(uri).body(saidaN);
    }

    @GetMapping("/saidas")
    public ResponseEntity<Page<DadosListagemSaida>> listarSaidas (@PageableDefault (size = 10, sort = {"data"}) Pageable paginacao) {
        var page = service.listarSaidas(paginacao);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/saidas/{id}")
    public ResponseEntity infoSaida (@PathVariable Long id){
        DadosFinanceiroSaidaG saida = service.infoSaida(id);
        return ResponseEntity.ok(saida);
    }

    @GetMapping("/saldo")
    public ResponseEntity<DadosContaG> saldo(){
        DadosContaG conta = service.contaSaldo();
        return ResponseEntity.ok(conta);
    }

}
