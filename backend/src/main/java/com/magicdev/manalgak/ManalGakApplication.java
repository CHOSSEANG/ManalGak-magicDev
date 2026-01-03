package com.magicdev.manalgak;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ManalGakApplication {

	public static void main(String[] args) {
		SpringApplication.run(ManalGakApplication.class, args);
	}

}
