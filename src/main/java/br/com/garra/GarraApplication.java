package br.com.garra;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class GarraApplication {

	public static void main(String[] args) {
		SpringApplication.run(GarraApplication.class, args);
	}


}
