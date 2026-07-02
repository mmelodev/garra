package br.com.garra.domain.validation;

import br.com.garra.domain.enums.FinanceiroEntradaCategoria;
import br.com.garra.domain.model.DadosFinanceiroEntrada;
import br.com.garra.exeption.ValidacaoException;
import br.com.garra.repository.FinanceiroEntradaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;

@Component
public class ValidacaoEvento implements ValidarEntradaFinanceira{

    @Override
    public void validar(DadosFinanceiroEntrada dados) {
        if(dados.categoria() == FinanceiroEntradaCategoria.EVENTO){
            if(dados.dataEvento() == null){
                throw new ValidacaoException("Data do Evento não pode ser vazia.");
            }

            if(dados.dataFimEvento() != null){
                var dataEvento = dados.dataEvento();
                var dataFimEvento = dados.dataFimEvento();
                Duration duracaoEvento = Duration.between(dataEvento, dataFimEvento);
                System.out.println("Dias do Evento: " + duracaoEvento.toDays());
            }
        }
    }
}
