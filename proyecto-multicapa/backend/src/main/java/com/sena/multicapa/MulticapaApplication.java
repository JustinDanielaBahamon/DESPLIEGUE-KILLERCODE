package com.sena.multicapa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada de la aplicación backend.
 * Proyecto multicapa - SENA (Docker sobre Linux).
 */
@SpringBootApplication
public class MulticapaApplication {

    public static void main(String[] args) {
        SpringApplication.run(MulticapaApplication.class, args);
    }

}
