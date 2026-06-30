package br.com.garra.controller;

import br.com.garra.domain.model.DadosAutenticacao;
import br.com.garra.domain.dto.RegisterG;
import br.com.garra.domain.entity.Usuario;
import br.com.garra.domain.model.DadosRegistro;
import br.com.garra.infra.security.TokenJWT;
import br.com.garra.repository.UsuarioRepository;
import br.com.garra.service.TokenService;
import br.com.garra.service.UsuarioService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@SecurityRequirement(name = "bearer-key")
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    @Transactional
    public ResponseEntity login(@RequestBody @Valid DadosAutenticacao dados){
        var authtoken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
        var authentication = manager.authenticate(authtoken);
        var token = tokenService.gerarToken((Usuario) authentication.getPrincipal());
        return ResponseEntity.ok(new TokenJWT(token));
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity register (@RequestBody @Valid DadosRegistro registro){

        if(this.repository.findByLogin(registro.login()) != null) return ResponseEntity.badRequest().build();

        usuarioService.cadastroUsuario(registro);

        return ResponseEntity.ok().build();
    }
}
