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
        return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Error en el servidor.");
    }
}
}
