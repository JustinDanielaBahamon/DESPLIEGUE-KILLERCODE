package com.sena.multicapa.repository;

import com.sena.multicapa.entity.Moto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MotoRepository extends JpaRepository<Moto, Long> {

    Optional<Moto> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    @Query("SELECT m FROM Moto m WHERE " +
            "LOWER(m.codigo) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
            "LOWER(m.marca) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
            "LOWER(m.modelo) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Moto> buscar(@Param("texto") String texto);
}
