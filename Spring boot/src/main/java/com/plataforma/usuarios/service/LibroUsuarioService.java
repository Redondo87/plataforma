package com.plataforma.usuarios.service;

import com.plataforma.usuarios.model.LibroUsuario;
import com.plataforma.usuarios.model.repository.LibroUsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LibroUsuarioService {

    private final LibroUsuarioRepository libroUsuarioRepository;

    public LibroUsuarioService(LibroUsuarioRepository libroUsuarioRepository) {
        this.libroUsuarioRepository = libroUsuarioRepository;
    }

    public List<LibroUsuario> findByUsuarioId(Long usuarioId) {
        return libroUsuarioRepository.findByUsuario_Id(usuarioId);
    }

    public Optional<LibroUsuario> findByUsuarioAndLibro(Long usuarioId, String libroId) {
        return libroUsuarioRepository.findByUsuario_IdAndLibroId(usuarioId, libroId);
    }

    public List<Object[]> findTopRated() {
        return libroUsuarioRepository.findTopRatedByLibroId();
    }

    public LibroUsuario guardar(LibroUsuario libroUsuario) {
        return libroUsuarioRepository.save(libroUsuario);
    }
}