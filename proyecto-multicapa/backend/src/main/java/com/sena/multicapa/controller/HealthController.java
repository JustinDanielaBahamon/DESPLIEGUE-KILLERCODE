package com.sena.multicapa.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Endpoint mínimo para comprobar que el backend está arriba y responde
 * dentro de la red Docker. No contiene lógica de negocio: solo sirve como
 * verificación inicial de la comunicación frontend -> backend.
 */
@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "UP",
                "service", "multicapa-backend"
        );
    }

}
