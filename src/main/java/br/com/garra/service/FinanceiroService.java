package br.com.garra.service;

import br.com.garra.domain.dto.DadosContaG;
import br.com.garra.domain.dto.DadosFinanceiroEntradaG;
import br.com.garra.domain.dto.DadosFinanceiroSaidaG;
import br.com.garra.domain.entity.Aluno;
import br.com.garra.domain.entity.FinanceiroConta;
import br.com.garra.domain.entity.FinanceiroEntrada;
import br.com.garra.domain.entity.FinanceiroSaida;
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
        FinanceiroEntrada financeiroEntrada = new FinanceiroEntrada();

        if (dados.categoria() == FinanceiroEntradaCategoria.MENSALIDADE){
            if (dados.alunoId() == null){
                try {
                    throw new ValidacaoException("ID do aluno não pode ser nulo");
                } catch (ValidacaoException e) {
                    throw new RuntimeException(e);
                }
            }

            Aluno aluno = alunoRepository.findById(dados.alunoId()).orElseThrow(() -> new ValidationException("Nenhum aluno encontrado."));

            if(dados.statusMensalidade() != StatusMensalidade.PAGO){
                var data = dados.dataVencimento();
                LocalDateTime dataAtual = LocalDateTime.now();

                if(dataAtual.isAfter(data)){
                    var atrasado = StatusMensalidade.ATRASADO;
                    financeiroEntrada.setStatusMensalidade(atrasado);
                }
            }

            financeiroEntrada.setAluno(aluno);
        }

        validadores.forEach(v -> v.validar(dados));

        financeiroEntrada.setData(dados.data());
        financeiroEntrada.setDataVencimento(dados.dataVencimento());
        financeiroEntrada.setCategoria(dados.categoria());
        financeiroEntrada.setDescricao(dados.descricao());
        financeiroEntrada.setValor(dados.valor());

        FinanceiroEntrada entrada = entradaRepository.save (financeiroEntrada);

        if (dados.statusMensalidade() == StatusMensalidade.PAGO){
            FinanceiroConta conta = new FinanceiroConta();
            var valorAtual = dados.valor();
            var saldoAtual = conta.getSaldo();
            var novoSaldo = valorAtual += saldoAtual;
            System.out.println(novoSaldo);
            financeiroEntrada.setConta(dados.conta());
        }
        return new DadosFinanceiroEntradaG(entrada);
    }

    public DadosFinanceiroSaidaG cadastrarSaida(DadosFinanceiroSaida dados){
        FinanceiroSaida financeiroSaida = new FinanceiroSaida();

        financeiroSaida.setValor(dados.valor());
        financeiroSaida.setData(dados.data());
        financeiroSaida.setDescricao(dados.descricao());
        financeiroSaida.setCategoria(dados.categoria());
        financeiroSaida.setTipoFinanceiroSaida(dados.tipoFinanceiroSaida());

        FinanceiroSaida saida = saidaRepository.save(financeiroSaida);
        return new DadosFinanceiroSaidaG(saida);
    }

    public DadosContaG balancoFinanceiro(DadosFinanceiroConta dadosConta, DadosFinanceiroEntrada dadosEntrada, DadosFinanceiroSaida dadosSaida){
        FinanceiroConta financeiroConta = new FinanceiroConta();

        FinanceiroConta conta = contaRepository.save(financeiroConta);
        return new DadosContaG(conta);
    }
}
