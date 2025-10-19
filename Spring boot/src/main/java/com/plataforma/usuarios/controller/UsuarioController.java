package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

  @PostMapping("/registrar")
public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
    try {
        Usuario registrado = usuarioService.registrarUsuario(usuario);
        return ResponseEntity.ok(registrado);
    } catch (IllegalArgumentException e) {
        System.err.println("⚠️ Error de validación: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
        System.err.println("❌ Error general en el servidor:");
        e.printStackTrace(); // 👈 Esto imprimirá el error SQL exacto en la consola
        return ResponseEntity.internalServerError().body("Error en el servidor.");
    }
}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        Usuario encontrado = usuarioService.validarLogin(usuario.getEmail(), usuario.getContrasena());
        if (encontrado != null) {
            return ResponseEntity.ok(encontrado); // Devuelve el usuario encontrado (id, nombre, email)
        } else {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
    }

}
