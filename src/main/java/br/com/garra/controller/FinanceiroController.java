package br.com.garra.controller;

import br.com.garra.domain.dto.DadosFinanceiroEntradaG;
import br.com.garra.domain.dto.DadosFinanceiroSaidaG;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @PostMapping("/saidas")
    @Transactional
    public ResponseEntity<DadosFinanceiroSaidaG> saidas (@RequestBody @Valid DadosFinanceiroSaida saida, UriComponentsBuilder uriComponentsBuilder){
        DadosFinanceiroSaidaG saidaN = service.cadastrarSaida(saida);
        var uri = uriComponentsBuilder.path("financeiro/saidas/{id}").buildAndExpand(saidaN).toUri();
        return ResponseEntity.created(uri).body(saidaN);
    }

}
