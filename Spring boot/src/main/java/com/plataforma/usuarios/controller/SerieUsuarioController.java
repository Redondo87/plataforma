package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.model.SerieUsuario;
import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.model.dto.SerieUsuarioDTO;
import com.plataforma.usuarios.model.repository.SerieUsuarioRepository;
import com.plataforma.usuarios.model.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series-usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class SerieUsuarioController {

    @Autowired
    private SerieUsuarioRepository serieUsuarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 🔹 Guardar o actualizar
    @PostMapping
    public SerieUsuario guardarSerie(@RequestBody SerieUsuarioDTO dto) {

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Buscar si ya existe
        SerieUsuario su = serieUsuarioRepository
                .findByUsuario_IdAndItemId(dto.getUsuarioId(), dto.getItemId())
                .orElse(new SerieUsuario());

        su.setUsuario(usuario);
        su.setItemId(dto.getItemId());
        su.setTitulo(dto.getTitulo());
        su.setTipo(dto.getTipo());
        su.setEstado(dto.getEstado());
        su.setPuntuacion(dto.getPuntuacion());
        su.setTemporada(dto.getTemporada());
        su.setCapitulo(dto.getCapitulo());

        return serieUsuarioRepository.save(su);
    }

    // 🔹 Listar por usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<SerieUsuario> listarPorUsuario(@PathVariable Long usuarioId) {
        return serieUsuarioRepository.findByUsuario_Id(usuarioId);
    }

    // 🔹 NUEVO: obtener por usuario + item
    @GetMapping("/usuario/{usuarioId}/item/{itemId}")
    public SerieUsuario obtenerPorUsuarioYItem(
            @PathVariable Long usuarioId,
            @PathVariable Long itemId) {

        return serieUsuarioRepository
                .findByUsuario_IdAndItemId(usuarioId, itemId)
                .orElse(null);
    }
}