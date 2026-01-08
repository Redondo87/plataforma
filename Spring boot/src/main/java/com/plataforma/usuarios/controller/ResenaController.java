package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.model.Resena;
import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.model.dto.ResenaDTO;
import com.plataforma.usuarios.model.repository.ResenaRepository;
import com.plataforma.usuarios.model.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "http://localhost:4200")
public class ResenaController {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ✅ GET /api/resenas?tipo=libro&itemId=XXXX
    @GetMapping
    public List<Resena> listar(@RequestParam String tipo, @RequestParam String itemId) {
        return resenaRepository.findByTipoAndItemIdOrderByFechaCreacionDesc(tipo, itemId);
    }

    // ✅ POST /api/resenas
    @PostMapping
    public Resena crear(@RequestBody ResenaDTO dto) {

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Resena resena = new Resena();
        resena.setUsuario(usuario);
        resena.setTipo(dto.getTipo());
        resena.setItemId(dto.getItemId());

        // ✅ contenido (no texto)
        resena.setContenido(dto.getContenido());

        resena.setPuntuacion(dto.getPuntuacion());

        return resenaRepository.save(resena);
    }
}
