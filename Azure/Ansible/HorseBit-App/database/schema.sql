-- =============================================================
-- HorseBit Platform - Schema de Base de Datos
-- Motor: MariaDB / MySQL
-- =============================================================

CREATE DATABASE IF NOT EXISTS horsebit
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE horsebit;

-- Tabla principal de caballos y estadísticas
CREATE TABLE IF NOT EXISTS caballos (
    id        INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre    VARCHAR(50)  NOT NULL,
    ganadas   INT          NOT NULL DEFAULT 0,
    derrotas  INT          NOT NULL DEFAULT 0,
    creado_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales de los 6 caballos
INSERT INTO caballos (nombre) VALUES
    ('TRUENO'),
    ('RELAMPAGO'),
    ('PEGASO'),
    ('TORNADO'),
    ('CENTELLA'),
    ('COMETA')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- Tabla de historial de carreras
CREATE TABLE IF NOT EXISTS carreras (
    id           INT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    caballo_id   INT      NOT NULL,
    fecha        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caballo_id) REFERENCES caballos(id)
);

-- Usuario de aplicación con permisos mínimos
CREATE USER IF NOT EXISTS 'horse_user'@'localhost' IDENTIFIED BY 'horse_pass';
GRANT SELECT, UPDATE, INSERT ON horsebit.* TO 'horse_user'@'localhost';
FLUSH PRIVILEGES;
