package com.plataforma.usuarios.model.repository;

import com.plataforma.usuarios.model.SerieUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SerieUsuarioRepository extends JpaRepository<SerieUsuario, Long> {

    // Listar todas las series/películas de un usuario
    List<SerieUsuario> findByUsuario_Id(Long usuarioId);

    // Buscar una serie/película concreta por usuario + itemId
    Optional<SerieUsuario> findByUsuario_IdAndItemId(Long usuarioId, Long itemId);
}