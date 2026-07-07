package br.com.garra.service;

import br.com.garra.domain.dto.*;
import br.com.garra.domain.entity.*;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.FinanceiroSaidaCategoria;
import br.com.garra.domain.enums.StatusMensalidade;
import br.com.garra.domain.model.DadosFinanceiroConta;
import br.com.garra.domain.model.DadosFinanceiroEntrada;
import br.com.garra.domain.model.DadosFinanceiroSaida;
import br.com.garra.domain.validation.ValidarEntradaFinanceira;
import br.com.garra.exeption.ValidacaoException;
import br.com.garra.repository.AlunoRepository;
import br.com.garra.repository.ContaRepository;
import br.com.garra.repository.FinanceiroEntradaRepository;
import br.com.garra.repository.FinanceiroSaidaRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FinanceiroService {

    @Autowired
    private FinanceiroEntradaRepository entradaRepository;
    @Autowired
    private FinanceiroSaidaRepository saidaRepository;
    @Autowired
    private AlunoRepository alunoRepository;
    @Autowired
    private List<ValidarEntradaFinanceira> validadores;
    @Autowired
    private ContaRepository contaRepository;

    public DadosFinanceiroEntradaG cadastrarEntrada(DadosFinanceiroEntrada dados){

        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        FinanceiroEntrada financeiroEntrada = new FinanceiroEntrada();

        Object principal = authentication.getPrincipal();
        Usuario usuario = null;
        if (principal instanceof Usuario) {
            usuario = (Usuario) principal;
            System.out.println(usuario.getLogin());
            System.out.println(usuario.getRole());
            System.out.println(usuario.getConta().getId());
            financeiroEntrada.setConta(usuario.getConta());
        }

        if (usuario == null) {
            throw new ValidacaoException("Usuário não autenticado");
        }

        FinanceiroConta conta = usuario.getConta();

        validadores.forEach(v -> v.validar(dados));

        if(dados.categoria() == FinanceiroEntradaCategoria.OUTROS){
            if(dados.descricao() == null){
                throw new ValidacaoException("Descrição é obrigatória nesse caso.");
            }
        }

        var dataAtual = LocalDateTime.now();
        financeiroEntrada.setData(dataAtual);
        financeiroEntrada.setDataVencimento(dados.dataVencimento());
        financeiroEntrada.setDataEvento(dados.dataEvento());
        financeiroEntrada.setDataFimEvento(dados.dataFimEvento());
        financeiroEntrada.setCategoria(dados.categoria());
        financeiroEntrada.setDescricao(dados.descricao());
        financeiroEntrada.setValor(dados.valor());
        financeiroEntrada.setStatusMensalidade(dados.statusMensalidade());

        if (dados.categoria() == FinanceiroEntradaCategoria.MENSALIDADE) {
            Aluno aluno = alunoRepository.findById(dados.alunoId())
                    .orElseThrow(() -> new ValidacaoException("Aluno não encontrado"));
            financeiroEntrada.setAluno(aluno);

            if (dados.statusMensalidade() != StatusMensalidade.PAGO) {
                if (dataAtual.isAfter(dados.dataVencimento())) {
                    financeiroEntrada.setStatusMensalidade(StatusMensalidade.ATRASADO);
                }
            }
        }

        FinanceiroEntrada entrada = entradaRepository.save(financeiroEntrada);

        if (dados.statusMensalidade() == StatusMensalidade.PAGO || !(dados.categoria() == FinanceiroEntradaCategoria.MENSALIDADE)){
            double saldoNovo = conta.getSaldo() + dados.valor();
            conta.setSaldo(saldoNovo);
            contaRepository.save(conta);
        }

        return new DadosFinanceiroEntradaG(entrada);
    }

    public Page<DadosListagemEntradas> listarEntradas (@PageableDefault (size = 10, sort = {"data"}) Pageable paginacao){
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        FinanceiroEntrada financeiroEntrada = new FinanceiroEntrada();

        Object principal = authentication.getPrincipal();
        Usuario usuario = null;
        if (principal instanceof Usuario) {
            usuario = (Usuario) principal;
            System.out.println(usuario.getLogin());
            System.out.println(usuario.getRole());
            System.out.println(usuario.getConta().getId());
            financeiroEntrada.setConta(usuario.getConta());
        }

        if (usuario == null) {
            throw new ValidacaoException("Usuário não autenticado");
        }

        return entradaRepository.findAll(paginacao).map(DadosListagemEntradas::new);
    }

    public DadosFinanceiroEntradaG infoEntrada(Long id){
        FinanceiroEntrada financeiroEntrada = entradaRepository.getReferenceById(id);
        return new DadosFinanceiroEntradaG(financeiroEntrada);
    }

    public DadosFinanceiroSaidaG cadastrarSaida(DadosFinanceiroSaida dados){
        FinanceiroSaida financeiroSaida = new FinanceiroSaida();

        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        Object principal = authentication.getPrincipal();
        Usuario usuario = null;
        if (principal instanceof Usuario) {
            usuario = (Usuario) principal;
            System.out.println(usuario.getLogin());
            System.out.println(usuario.getRole());
            System.out.println(usuario.getConta().getId());
            financeiroSaida.setConta(usuario.getConta());
        }

        if (usuario == null) {
            throw new ValidacaoException("Usuário não autenticado");
        }

        FinanceiroConta conta = usuario.getConta();

        financeiroSaida.setValor(dados.valor());
        financeiroSaida.setData(dados.data());
        financeiroSaida.setDescricao(dados.descricao());
        financeiroSaida.setCategoria(dados.categoria());
        financeiroSaida.setTipoFinanceiroSaida(dados.tipoFinanceiroSaida());

        FinanceiroSaida saida = saidaRepository.save(financeiroSaida);

        if (conta.getSaldo() < dados.valor()) {
            throw new ValidacaoException("Saldo insuficiente. Saldo atual: R$ " + conta.getSaldo());
        }

        double saldoNovo = conta.getSaldo() - dados.valor();
        conta.setSaldo(saldoNovo);
        contaRepository.save(conta);

        return new DadosFinanceiroSaidaG(saida);
    }

    public Page<DadosListagemSaida> listarSaidas (@PageableDefault (size = 10, sort = {"data"}) Pageable paginacao){
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        FinanceiroSaida financeiroSaida = new FinanceiroSaida();

        Object principal = authentication.getPrincipal();
        Usuario usuario = null;
        if (principal instanceof Usuario) {
            usuario = (Usuario) principal;
            System.out.println(usuario.getLogin());
            System.out.println(usuario.getRole());
            System.out.println(usuario.getConta().getId());
            financeiroSaida.setConta(usuario.getConta());
        }

        if (usuario == null) {
            throw new ValidacaoException("Usuário não autenticado");
        }

        return saidaRepository.findAll(paginacao).map(DadosListagemSaida::new);
    }

    public DadosFinanceiroSaidaG infoSaida (Long id){
        FinanceiroSaida saida = saidaRepository.getReferenceById(id);
        return new DadosFinanceiroSaidaG(saida);
    }

    public DadosContaG contaSaldo(){
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        Object principal = authentication.getPrincipal();
        Usuario usuario = null;
        if (principal instanceof Usuario) {
            usuario = (Usuario) principal;
            System.out.println(usuario.getLogin());
            System.out.println(usuario.getRole());
            System.out.println(usuario.getConta().getId());
        }

        if (usuario == null) {
            throw new ValidacaoException("Usuário não autenticado");
        }

        FinanceiroConta conta = contaRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ValidacaoException("Conta não encontrada"));

        return new DadosContaG(conta);
    }
}
