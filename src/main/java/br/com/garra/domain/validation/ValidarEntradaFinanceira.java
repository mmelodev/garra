package br.com.garra.domain.validation;

import br.com.garra.domain.model.DadosFinanceiroEntrada;
import br.com.garra.exeption.ValidacaoException;

public interface ValidarEntradaFinanceira {
    void validar (DadosFinanceiroEntrada dados) ;
}
