package br.com.garra.domain.validation;

import br.com.garra.domain.entity.Aluno;
import br.com.garra.domain.entity.FinanceiroEntrada;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.model.DadosFinanceiroEntrada;
import br.com.garra.exeption.ValidacaoException;
import br.com.garra.repository.AlunoRepository;
import br.com.garra.repository.FinanceiroEntradaRepository;
import br.com.garra.repository.FinanceiroSaidaRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

@Component
public class ValidacaoMatricula implements ValidarEntradaFinanceira{

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private FinanceiroEntradaRepository entradaRepository;

    @Override
    public void validar(DadosFinanceiroEntrada dados) {
        if(dados.categoria() == FinanceiroEntradaCategoria.MATRICULA){
            if (dados.alunoId() == null){
                try {
                    throw new ValidacaoException("ID do aluno não pode ser nulo");
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
                throw new ValidacaoException("Não pode lançar outra matrícula para esse aluno no mês atual.");
            }
        }
    }
}
