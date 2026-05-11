package br.com.garra.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http.csrf(c -> c.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("/auth/register").permitAll() //temporario
                        .requestMatchers(HttpMethod.POST,"/professor").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/professor").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/aluno").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/aluno").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/professor").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/aluno").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/professor").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/aluno").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/professor").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/aluno").hasRole("USER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager (AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}