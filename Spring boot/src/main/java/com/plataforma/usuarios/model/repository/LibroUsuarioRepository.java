package com.plataforma.usuarios.model.repository;

import com.plataforma.usuarios.model.LibroUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LibroUsuarioRepository extends JpaRepository<LibroUsuario, Long> {

    List<LibroUsuario> findByUsuario_Id(Long usuarioId);

    Optional<LibroUsuario> findByUsuario_IdAndLibroId(Long usuarioId, String libroId);

    @Query("""
        SELECT l.libroId, AVG(l.puntuacion), COUNT(l.puntuacion)
        FROM LibroUsuario l
        WHERE l.puntuacion IS NOT NULL
        GROUP BY l.libroId
        ORDER BY AVG(l.puntuacion) DESC
    """)
    List<Object[]> findTopRatedByLibroId();
}