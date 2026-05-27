package br.com.garra.service;

import br.com.garra.domain.dto.DadosFinanceiroEntradaG;
import br.com.garra.domain.entity.Aluno;
import br.com.garra.domain.entity.FinanceiroEntrada;
import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.model.DadosFinanceiroEntrada;
import br.com.garra.domain.validation.ValidarEntradaFinanceira;
import br.com.garra.exeption.ValidacaoException;
import br.com.garra.repository.AlunoRepository;
import br.com.garra.repository.FinanceiroEntradaRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinanceiroService {

    @Autowired
    private FinanceiroEntradaRepository entradaRepository;
    @Autowired
    private AlunoRepository alunoRepository;
    @Autowired
    private List<ValidarEntradaFinanceira> validadores;
    private FinanceiroEntrada entrada;

    public DadosFinanceiroEntradaG cadastrarEntrada(DadosFinanceiroEntrada dados) {
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
            financeiroEntrada.setAluno(aluno);

            //restante das RN a partir da mensalidade

        }

        validadores.forEach(v -> v.validar(dados));

        financeiroEntrada.setData(dados.data());
        financeiroEntrada.setCategoria(dados.categoria());
        financeiroEntrada.setDescricao(dados.descricao());
        financeiroEntrada.setValor(dados.valor());

        FinanceiroEntrada entrada = entradaRepository.save(financeiroEntrada);
        return new DadosFinanceiroEntradaG(entrada);
    }
}
