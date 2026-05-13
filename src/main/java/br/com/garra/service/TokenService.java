package br.com.garra.service;

import br.com.garra.domain.entity.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token}")
    private String secret;

    public String gerarToken(Usuario usuario){
        try{
            var algortimo = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("API garra")
                    .withSubject(usuario.getLogin())
                    .withClaim("id", usuario.getId())
                    .withClaim("role", usuario.getRole().name())
                    .withExpiresAt(dataExpiracao())
                    .sign(algortimo);
        } catch (JWTVerificationException exception){
            throw new RuntimeException("Erro na geração do token de acesso - " + exception);
        }
    }

    public String getSubject (String token){
        try {
            var algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer("API garra")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException ex){
            throw new RuntimeException(ex);
        }
    }

    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(3).toInstant(ZoneOffset.of("-03:00"));
    }
}
