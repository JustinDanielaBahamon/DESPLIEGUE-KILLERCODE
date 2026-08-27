package com.sena.multicapa.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Entidad JPA que representa una moto en el inventario.
 * Mapea directamente a la tabla `motos` en MySQL.
 */
@Entity
@Table(name = "motos")
public class Moto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código es obligatorio")
    @Column(name = "codigo", nullable = false, unique = true, length = 10)
    private String codigo;

    @NotBlank(message = "La marca es obligatoria")
    @Column(name = "marca", nullable = false, length = 60)
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    @Column(name = "modelo", nullable = false, length = 60)
    private String modelo;

    @NotNull(message = "El año es obligatorio")
    @Min(value = 1980, message = "El año debe ser mayor a 1980")
    @Max(value = 2100, message = "El año no es válido")
    @Column(name = "anio", nullable = false)
    private Integer anio;

    @NotNull(message = "La cilindrada es obligatoria")
    @Min(value = 1, message = "La cilindrada debe ser mayor a 0")
    @Column(name = "cilindrada", nullable = false)
    private Integer cilindrada;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    @Column(name = "stock", nullable = false)
    private Integer stock;

    public Moto() {
    }

    public Moto(Long id, String codigo, String marca, String modelo, Integer anio, Integer cilindrada, Integer stock) {
        this.id = id;
        this.codigo = codigo;
        this.marca = marca;
        this.modelo = modelo;
        this.anio = anio;
        this.cilindrada = cilindrada;
        this.stock = stock;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
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
