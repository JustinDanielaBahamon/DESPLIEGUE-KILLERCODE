-- ============================================
-- 01-dml.sql
-- Datos iniciales (DML) - Proyecto Multicapa SENA
--
-- Se ejecuta después de 00-ddl.sql (el orden numérico del nombre de
-- archivo determina el orden de ejecución dentro de
-- /docker-entrypoint-initdb.d).
-- ============================================

INSERT INTO motos (codigo, marca, modelo, anio, cilindrada, stock) VALUES
    ('M001', 'Yamaha',   'MT-07',       2023, 689, 15),
    ('M002', 'Honda',    'CB500F',      2022, 471, 22),
    ('M003', 'Kawasaki', 'Ninja 400',   2023, 399, 9),
    ('M004', 'Suzuki',   'V-Strom 650', 2021, 645, 18);
