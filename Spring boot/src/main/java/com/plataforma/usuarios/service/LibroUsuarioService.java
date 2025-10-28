package com.plataforma.usuarios.service;

import com.plataforma.usuarios.model.LibroUsuario;
import com.plataforma.usuarios.model.repository.LibroUsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LibroUsuarioService {

    private final LibroUsuarioRepository libroUsuarioRepository;

    public LibroUsuarioService(LibroUsuarioRepository libroUsuarioRepository) {
        this.libroUsuarioRepository = libroUsuarioRepository;
    }

    public List<LibroUsuario> findByUsuarioId(Long usuarioId) {
        return libroUsuarioRepository.findByUsuarioId(usuarioId);
    }

    public List<Object[]> findTopRated() {
        return libroUsuarioRepository.findTopRatedByLibroId();
    }

    public LibroUsuario guardar(LibroUsuario libroUsuario) {
        return libroUsuarioRepository.save(libroUsuario);
    }
}
