package com.sena.multicapa.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

/**
 * DTO usado para crear y actualizar una moto (entrada de la API).
 */
public class MotoRequestDTO {

    @NotBlank(message = "La placa es obligatoria")
    @Size(max = 10, message = "La placa no puede superar 10 caracteres")
    private String placa;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    @NotNull(message = "El año es obligatorio")
    @Min(value = 1980, message = "El año no es válido")
    private Integer anio;

    @NotNull(message = "El cilindraje es obligatorio")
    @Positive(message = "El cilindraje debe ser mayor a 0")
    private Integer cilindraje;

    @NotBlank(message = "El color es obligatorio")
    private String color;

    @NotNull(message = "El precio es obligatorio")
    @PositiveOrZero(message = "El precio no puede ser negativo")
    private BigDecimal precio;

    private Boolean disponible = true;

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

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

    public Integer getCilindraje() {
        return cilindraje;
    }

    public void setCilindraje(Integer cilindraje) {
        this.cilindraje = cilindraje;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}
