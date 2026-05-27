package br.com.garra.domain.validation;

import br.com.garra.domain.entity.Aluno;
import br.com.garra.domain.entity.FinanceiroEntrada;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.model.DadosFinanceiroEntrada;
import br.com.garra.exeption.ValidacaoException;
import br.com.garra.repository.AlunoRepository;
import br.com.garra.repository.FinanceiroEntradaRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MesmoAlunoNoMes implements ValidarEntradaFinanceira {
    @Autowired
    private FinanceiroEntradaRepository entradaRepository;
    @Autowired
    private AlunoRepository alunoRepository;

    @Override
    public void validar(DadosFinanceiroEntrada dados) throws ValidacaoException {
        if(dados.alunoId() == null){
            throw new ValidacaoException("ID do aluno não pode ser nulo");
        } else {
            if(dados.categoria() == FinanceiroEntradaCategoria.MENSALIDADE){
                Aluno aluno = alunoRepository.findById(dados.alunoId()).orElseThrow(() -> new ValidationException("Nenhum aluno encontrado."));
                FinanceiroEntrada entrada = entradaRepository.findById(aluno.getId());
                if(entrada.getData().getMonth().equals(LocalDateTime.now().getMonth())){
                    throw new ValidationException("Não pode lançar outra mensalidade para esse mês");
                }

//                if (dados.alunoId().equals(aluno.getId()) && !dados.data().getMonth().equals(LocalDateTime.now().getMonth())){
//                    throw new ValidationException("Não pode lançar outra mensalidade para esse mês");
//                }
            }
        }

//        if (dados.categoria() == FinanceiroEntradaCategoria.MENSALIDADE && dados.alunoId().equals(aluno.getId()) && dados.data().isEqual(aluno.getDataMatricula().withMonth(aluno.getDataMatricula().getMonthValue()).atStartOfDay())){
//            if (dados.alunoId() == null){
//                try {
//                    throw new ValidacaoException("ID do aluno não pode ser nulo");
//                } catch (ValidacaoException e) {
//                    throw new RuntimeException(e);
//                }
//            }
//            financeiroEntrada.setAluno(aluno);
//        }
    }
}
