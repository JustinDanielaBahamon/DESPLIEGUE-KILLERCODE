package com.sena.multicapa.service;

import com.sena.multicapa.dto.MotoRequest;
import com.sena.multicapa.dto.MotoResponse;
import com.sena.multicapa.entity.Moto;
import com.sena.multicapa.exception.ResourceNotFoundException;
import com.sena.multicapa.repository.MotoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class MotoService {

    private final MotoRepository motoRepository;

    public MotoService(MotoRepository motoRepository) {
        this.motoRepository = motoRepository;
    }

    @Transactional(readOnly = true)
    public List<MotoResponse> listar() {
        return motoRepository.findAll().stream()
                .sorted(Comparator.comparing(Moto::getCodigo))
                .map(MotoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MotoResponse> buscar(String texto) {
        if (texto == null || texto.isBlank()) {
            return listar();
        }
        return motoRepository.buscar(texto.trim()).stream()
                .sorted(Comparator.comparing(Moto::getCodigo))
                .map(MotoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public MotoResponse obtener(Long id) {
        return MotoResponse.fromEntity(buscarEntidad(id));
    }

    @Transactional
    public MotoResponse crear(MotoRequest request) {
        Moto moto = new Moto();
        moto.setCodigo(generarSiguienteCodigo());
        aplicarDatos(moto, request);
        return MotoResponse.fromEntity(motoRepository.save(moto));
    }

    @Transactional
    public MotoResponse actualizar(Long id, MotoRequest request) {
        Moto moto = buscarEntidad(id);
        aplicarDatos(moto, request);
        return MotoResponse.fromEntity(motoRepository.save(moto));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!motoRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se encontró la moto con id " + id);
        }
        motoRepository.deleteById(id);
    }

    private Moto buscarEntidad(Long id) {
        return motoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la moto con id " + id));
    }

    private void aplicarDatos(Moto moto, MotoRequest request) {
        moto.setMarca(request.getMarca().trim());
        moto.setModelo(request.getModelo().trim());
        moto.setAnio(request.getAnio());
        moto.setCilindrada(request.getCilindrada());
        moto.setStock(request.getStock());
    }

    /**
     * Genera el siguiente código correlativo (M001, M002, M003...) a partir
     * del último código existente en la tabla.
     */
    private String generarSiguienteCodigo() {
        long total = motoRepository.count();
        long siguiente = total + 1;
        String codigo;
        do {
            codigo = String.format("M%03d", siguiente);
            siguiente++;
        } while (motoRepository.existsByCodigo(codigo));
        return codigo;
    }
}
