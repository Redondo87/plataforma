package com.plataforma.usuarios.model.repository;

import com.plataforma.usuarios.model.LibroUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

public interface LibroUsuarioRepository extends JpaRepository<LibroUsuario, Long> {

    // ✅ Obtener todos los libros de un usuario específico
    List<LibroUsuario> findByUsuarioId(Long usuarioId);

    // ✅ Obtener los libros con mejor puntuación promedio
    @Query("SELECT l.libroId, AVG(l.puntuacion), COUNT(l.puntuacion) " +
           "FROM LibroUsuario l " +
           "WHERE l.puntuacion IS NOT NULL " +
           "GROUP BY l.libroId " +
           "ORDER BY AVG(l.puntuacion) DESC")
    List<Object[]> findTopRatedByLibroId();
}
