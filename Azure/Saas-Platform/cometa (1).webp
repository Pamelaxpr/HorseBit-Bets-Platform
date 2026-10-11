-- 1. Crear la Base de Datos
CREATE DATABASE IF NOT EXISTS horsebit;
USE horsebit;

-- 2. Crear la Tabla de Caballos
CREATE TABLE IF NOT EXISTS caballos (
    id INT PRIMARY KEY,
    nombre VARCHAR(50),
    ganadas INT DEFAULT 0,
    derrotas INT DEFAULT 0
);

-- 3. Insertar caballos (IDs del 0 al 5)
INSERT INTO caballos (id, nombre, ganadas, derrotas) VALUES
(0, 'TRUENO', 0, 0),
(1, 'RELÁMPAGO', 0, 0),
(2, 'PEGASO', 0, 0),
(3, 'TORNADO', 0, 0),
(4, 'CENTELLA', 0, 0),
(5, 'COMETA', 0, 0)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 4. Crear usuario y dar permisos (basado en director.py)
CREATE USER IF NOT EXISTS 'horse_user'@'localhost' IDENTIFIED BY 'horse_pass';
GRANT ALL PRIVILEGES ON horsebit.* TO 'horse_user'@'localhost';
FLUSH PRIVILEGES;
