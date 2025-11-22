package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.model.SerieUsuario;
import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.model.dto.SerieUsuarioDTO;
import com.plataforma.usuarios.model.repository.SerieUsuarioRepository;
import com.plataforma.usuarios.model.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/series-usuarios")
public class SerieUsuarioController {

    @Autowired
    private SerieUsuarioRepository serieUsuarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 🔹 Guardar serie/película en la lista de un usuario
    @PostMapping
    public SerieUsuario guardarSerie(@RequestBody SerieUsuarioDTO dto) {

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        SerieUsuario su = new SerieUsuario();
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

    // 🔹 Listar todas las series/películas de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<SerieUsuario> listarPorUsuario(@PathVariable Long usuarioId) {
        return serieUsuarioRepository.findAll()
                .stream()
                .filter(su -> su.getUsuario().getId().equals(usuarioId))
                .toList();
    }

    // Opcional: obtener un solo registro por ID
    @GetMapping("/{id}")
    public SerieUsuario obtenerPorId(@PathVariable Long id) {
        return serieUsuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado"));
    }
}
