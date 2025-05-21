package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public Usuario registrar(@RequestBody Usuario usuario) {
         return usuarioService.registrarUsuario(usuario); 
    }
}
