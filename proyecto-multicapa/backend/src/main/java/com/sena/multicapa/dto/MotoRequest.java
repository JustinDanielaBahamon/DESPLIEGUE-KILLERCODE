package com.sena.multicapa.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Datos que llegan del frontend al crear o actualizar una moto.
 * El código (M001, M002...) se genera en el backend, no lo envía el cliente.
 */
public class MotoRequest {

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    @NotNull(message = "El año es obligatorio")
    @Min(value = 1980, message = "El año debe ser mayor a 1980")
    @Max(value = 2100, message = "El año no es válido")
    private Integer anio;

    @NotNull(message = "La cilindrada es obligatoria")
    @Min(value = 1, message = "La cilindrada debe ser mayor a 0")
    private Integer cilindrada;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public Integer getCilindrada() {
        return cilindrada;
    }

    public void setCilindrada(Integer cilindrada) {
        this.cilindrada = cilindrada;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
