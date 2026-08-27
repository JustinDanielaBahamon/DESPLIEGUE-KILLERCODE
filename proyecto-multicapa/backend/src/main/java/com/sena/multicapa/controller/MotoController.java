package com.sena.multicapa.controller;

import com.sena.multicapa.dto.MotoRequest;
import com.sena.multicapa.dto.MotoResponse;
import com.sena.multicapa.service.MotoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * API REST del inventario de motos.
 * Base: /api/motos
 */
@RestController
@RequestMapping("/api/motos")
public class MotoController {

    private final MotoService motoService;

    public MotoController(MotoService motoService) {
        this.motoService = motoService;
    }

    @GetMapping
    public List<MotoResponse> listar(@RequestParam(name = "q", required = false) String q) {
        return motoService.buscar(q);
    }

    @GetMapping("/{id}")
    public MotoResponse obtener(@PathVariable Long id) {
        return motoService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MotoResponse crear(@Valid @RequestBody MotoRequest request) {
        return motoService.crear(request);
    }

    @PutMapping("/{id}")
    public MotoResponse actualizar(@PathVariable Long id, @Valid @RequestBody MotoRequest request) {
        return motoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        motoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
