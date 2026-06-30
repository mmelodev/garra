package br.com.garra.service;

import br.com.garra.domain.dto.RegisterG;
import br.com.garra.domain.entity.FinanceiroConta;
import br.com.garra.domain.entity.Usuario;
import br.com.garra.domain.model.DadosRegistro;
import br.com.garra.repository.ContaRepository;
import br.com.garra.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private ContaRepository contaRepository;

    public RegisterG cadastroUsuario (DadosRegistro dados){
        String encrPass = new BCryptPasswordEncoder().encode(dados.senha());
        Usuario novoUsario = new Usuario(dados.login(), encrPass, dados.role());

        FinanceiroConta conta = new FinanceiroConta();
        novoUsario.setConta(conta);
        conta.setUsuario(novoUsario);
        conta.setSaldo(0.0);
        conta.setData(LocalDateTime.now());
        contaRepository.save(conta);
        repository.save(novoUsario);

        return new RegisterG(novoUsario);
    }
}
