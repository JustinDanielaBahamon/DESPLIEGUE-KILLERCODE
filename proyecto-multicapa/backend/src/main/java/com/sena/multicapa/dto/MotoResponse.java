package com.sena.multicapa.dto;

import com.sena.multicapa.entity.Moto;

/**
 * Datos que el backend devuelve al frontend para cada moto.
 */
public class MotoResponse {

    private Long id;
    private String codigo;
    private String marca;
    private String modelo;
    private Integer anio;
    private Integer cilindrada;
    private Integer stock;

    public MotoResponse() {
    }

    public static MotoResponse fromEntity(Moto moto) {
        MotoResponse response = new MotoResponse();
        response.id = moto.getId();
        response.codigo = moto.getCodigo();
        response.marca = moto.getMarca();
        response.modelo = moto.getModelo();
        response.anio = moto.getAnio();
        response.cilindrada = moto.getCilindrada();
        response.stock = moto.getStock();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getMarca() {
        return marca;
    }

    public String getModelo() {
        return modelo;
    }

    public Integer getAnio() {
        return anio;
    }

    public Integer getCilindrada() {
        return cilindrada;
    }

    public Integer getStock() {
        return stock;
    }
}
