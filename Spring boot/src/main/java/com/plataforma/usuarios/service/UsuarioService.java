package com.plataforma.usuarios.service;

import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.model.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // ✅ Registrar usuario con validación y encriptación
    public Usuario registrarUsuario(Usuario usuario) {
        if (!esContrasenaSegura(usuario.getContrasena())) {
            throw new IllegalArgumentException("La contraseña no cumple con los requisitos de seguridad.");
        }

        // 🔒 Encriptar contraseña antes de guardar
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

        return usuarioRepository.save(usuario);
    }

    // ✅ Verifica que la contraseña cumpla los requisitos
    private boolean esContrasenaSegura(String contrasena) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$";
        return Pattern.matches(regex, contrasena);
    }

    // ✅ Validar login (compara contraseña cifrada)
    public Usuario validarLogin(String email, String contrasena) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        if (usuario != null && passwordEncoder.matches(contrasena, usuario.getContrasena())) {
            return usuario;
        }

        return null;
    }
}
