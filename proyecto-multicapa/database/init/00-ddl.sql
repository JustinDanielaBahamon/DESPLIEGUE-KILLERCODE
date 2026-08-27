-- ============================================
-- 00-ddl.sql
-- Definición de tablas (DDL) - Proyecto Multicapa SENA
--
-- Este script se ejecuta automáticamente al crear el contenedor de MySQL
-- por primera vez (montado en /docker-entrypoint-initdb.d).
-- ============================================

CREATE TABLE IF NOT EXISTS motos (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo      VARCHAR(10)  NOT NULL UNIQUE,
    marca       VARCHAR(60)  NOT NULL,
    modelo      VARCHAR(60)  NOT NULL,
    anio        INT          NOT NULL,
    cilindrada  INT          NOT NULL,
    stock       INT          NOT NULL DEFAULT 0,
    creado_en   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
