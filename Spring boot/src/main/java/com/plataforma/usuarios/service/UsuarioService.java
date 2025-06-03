package com.plataforma.usuarios.service;

import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.model.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        if (!esContrasenaSegura(usuario.getContrasena())) {
            throw new IllegalArgumentException("La contraseña no cumple con los requisitos de seguridad.");
        }

        return usuarioRepository.save(usuario);
    }

    private boolean esContrasenaSegura(String contrasena) {
        // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$";
        return Pattern.matches(regex, contrasena);
    }
}