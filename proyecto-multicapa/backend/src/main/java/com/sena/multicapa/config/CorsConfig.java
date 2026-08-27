package com.sena.multicapa.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Habilita CORS para que el frontend (servido en otro origen/puerto por
 * Nginx dentro de Docker) pueda consumir la API REST del backend.
 *
 * Se usa un patrón amplio ("*") porque en este proyecto de práctica el
 * frontend se expone en un puerto configurable (FRONTEND_PORT) y puede
 * accederse tanto por localhost como por la IP de la máquina virtual.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
