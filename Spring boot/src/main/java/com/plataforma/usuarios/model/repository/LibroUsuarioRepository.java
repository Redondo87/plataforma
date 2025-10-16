package com.plataforma.usuarios.model.repository;

import com.plataforma.usuarios.model.LibroUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LibroUsuarioRepository extends JpaRepository<LibroUsuario, Long> {
    // Método para obtener todos los libros de un usuario específico
    List<LibroUsuario> findByUsuarioId(Long usuarioId);
}
