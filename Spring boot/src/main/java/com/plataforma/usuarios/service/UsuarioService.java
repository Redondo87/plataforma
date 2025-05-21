package com.plataforma.usuarios.service;

import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.model.repository.UsuarioRepository;

import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
}
