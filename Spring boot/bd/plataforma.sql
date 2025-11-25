-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.12.0.7122
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para plataforma
CREATE DATABASE IF NOT EXISTS `plataforma` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `plataforma`;

-- Volcando estructura para tabla plataforma.libros_usuarios
CREATE TABLE IF NOT EXISTS `libros_usuarios` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `libro_id` varchar(100) NOT NULL,
  `estado` varchar(30) NOT NULL,
  `puntuacion` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `libros_usuarios_ibfk_1` (`usuario_id`),
  CONSTRAINT `libros_usuarios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla plataforma.libros_usuarios: ~10 rows (aproximadamente)
REPLACE INTO `libros_usuarios` (`id`, `usuario_id`, `libro_id`, `estado`, `puntuacion`, `fecha_creacion`) VALUES
	(2, 1, 'MzbHg3L4JuIC', 'terminado', 9, '2025-10-19 19:20:18'),
	(3, 1, 'lopEEQAAQBAJ', 'lectura', 8, '2025-10-20 15:36:30'),
	(4, 1, 'zobzEAAAQBAJ', 'terminado', 7, '2025-10-22 17:48:42'),
	(5, 1, 'zobzEAAAQBAJ', 'terminado', 7, '2025-10-23 13:55:55'),
	(6, 1, 'AC-REAAAQBAJ', 'plan para leer', 7, '2025-10-23 17:37:10'),
	(7, 1, 'eCW5EAAAQBAJ', 'terminado', 9, '2025-10-23 17:59:58'),
	(8, 2, 'awl0DwAAQBAJ', 'lectura', 7, '2025-10-29 19:23:44'),
	(9, 2, 'AC-REAAAQBAJ', 'plan para leer', 8, '2025-10-29 19:24:35'),
	(10, 1, 'zttSEAAAQBAJ', 'terminado', 9, '2025-11-04 19:06:50'),
	(11, 1, 'ujnRDgAAQBAJ', 'terminado', 9, '2025-11-05 19:07:37');

-- Volcando estructura para tabla plataforma.series_usuarios
CREATE TABLE IF NOT EXISTS `series_usuarios` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) unsigned NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `estado` varchar(30) NOT NULL,
  `puntuacion` int(11) DEFAULT NULL,
  `temporada` int(11) DEFAULT NULL,
  `capitulo` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `series_usuarios_ibfk_1` (`usuario_id`),
  CONSTRAINT `series_usuarios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla plataforma.series_usuarios: ~0 rows (aproximadamente)
REPLACE INTO `series_usuarios` (`id`, `usuario_id`, `item_id`, `titulo`, `tipo`, `estado`, `puntuacion`, `temporada`, `capitulo`, `fecha_creacion`) VALUES
	(1, 1, 1311031, 'Guardianes de la noche: Kimetsu no Yaiba La fortaleza infinita', 'pelicula', 'terminado', 7, NULL, NULL, '2025-11-23 19:10:06');

-- Volcando estructura para tabla plataforma.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla plataforma.usuario: ~3 rows (aproximadamente)
REPLACE INTO `usuario` (`id`, `nombre`, `contrasena`, `email`) VALUES
	(1, 'Ana', '$2a$10$4ICZdK4cS6RE7cRasATWV.bfxNO/LcaYYxL1B1NeV13eY9c7Y2Hcq', 'ana@gmail.com'),
	(2, 'Raul', '$2a$10$oHtdxkjPPNpqCO5TEGOS7etXqZFyEwquWnVoHku5QNDjwVUY8LyN6', 'raulga@gmail.com'),
	(3, 'Maria', '$2a$10$Jx/JWJex8rHGeTZgZzezK.yAvQybcL4qOfu3fvo6XwkJEeXQPhcv.', 'maria@gmail.com');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
