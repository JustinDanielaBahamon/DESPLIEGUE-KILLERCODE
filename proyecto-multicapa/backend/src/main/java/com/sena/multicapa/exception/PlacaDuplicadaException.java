package com.sena.multicapa.exception;

public class PlacaDuplicadaException extends RuntimeException {

    public PlacaDuplicadaException(String placa) {
        super("Ya existe una moto registrada con la placa: " + placa);
    }

}
