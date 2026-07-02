package br.com.garra.domain.validation;

import br.com.garra.domain.entity.Aluno;
import br.com.garra.domain.entity.FinanceiroConta;
import br.com.garra.domain.entity.FinanceiroEntrada;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.enums.StatusMensalidade;
import br.com.garra.domain.model.DadosFinanceiroEntrada;
import br.com.garra.exeption.ValidacaoException;
import br.com.garra.repository.AlunoRepository;
import br.com.garra.repository.FinanceiroEntradaRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

@Component
public class ValidacaoMensalidade implements ValidarEntradaFinanceira{

    @Autowired
    private FinanceiroEntradaRepository entradaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Override
    public void validar(DadosFinanceiroEntrada dados) {
        if (dados.categoria() == FinanceiroEntradaCategoria.MENSALIDADE){
            if (dados.alunoId() == null){
                try {
                    throw new ValidacaoException("ID do aluno não pode ser nulo.");
                } catch (ValidacaoException e) {
                    throw new RuntimeException(e);
                }
            }

            if (dados.dataVencimento() == null){
                try {
                    throw new ValidacaoException("A data de vencimento é obrigatória.");
                } catch (ValidacaoException e) {
                    throw new RuntimeException(e);
                }
            }

            Aluno aluno = alunoRepository.findById(dados.alunoId()).orElseThrow(() -> new ValidationException("Nenhum aluno encontrado."));

            var data = dados.data();
            LocalDateTime primeiroDia = data.with(TemporalAdjusters.firstDayOfMonth());
            LocalDateTime ultimoDia = data.with(TemporalAdjusters.lastDayOfMonth());
            var entrada = entradaRepository.existsByAlunoIdAndDataBetween(aluno.getId(), primeiroDia, ultimoDia);
            if(entrada){
                throw new ValidacaoException("Não pode lançar outra mensalidade para esse aluno no mês atual.");
            }

            if(dados.statusMensalidade() != StatusMensalidade.PAGO){
                LocalDateTime dataAtual = LocalDateTime.now();
                if (dataAtual.isAfter(dados.dataVencimento())) {
                    throw new ValidacaoException("Mensalidade está atrasada.");
                }
            }
        }
    }
}
