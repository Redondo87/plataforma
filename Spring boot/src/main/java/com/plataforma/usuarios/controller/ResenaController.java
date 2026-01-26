package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.model.Resena;
import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.model.dto.ResenaDTO;
import com.plataforma.usuarios.model.dto.ResenaResponseDTO;
import com.plataforma.usuarios.model.repository.ResenaRepository;
import com.plataforma.usuarios.model.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "http://localhost:4200")
public class ResenaController {

    @Autowired private ResenaRepository resenaRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    // GET /api/resenas?tipo=libro&itemId=XXX
    @GetMapping
    public List<ResenaResponseDTO> listar(@RequestParam String tipo, @RequestParam String itemId) {
        return resenaRepository.findByTipoIgnoreCaseAndItemIdOrderByFechaCreacionDesc(tipo, itemId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // POST /api/resenas
    @PostMapping
    public ResenaResponseDTO crear(@RequestBody ResenaDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Resena resena = new Resena();
        resena.setUsuario(usuario);
        resena.setTipo(dto.getTipo());
        resena.setItemId(dto.getItemId());
        resena.setContenido(dto.getContenido());
        resena.setPuntuacion(dto.getPuntuacion());
        resena.setImagenUrl(dto.getImagenUrl()); // ✅

        return toDto(resenaRepository.save(resena));
    }

    // GET /api/resenas/recientes?tipo=libro
    @GetMapping("/recientes")
    public List<ResenaResponseDTO> listarRecientes(@RequestParam(required = false) String tipo) {
        List<Resena> lista = (tipo == null || tipo.isBlank())
                ? resenaRepository.findAllByOrderByFechaCreacionDesc()
                : resenaRepository.findByTipoIgnoreCaseOrderByFechaCreacionDesc(tipo);

        return lista.stream().map(this::toDto).collect(Collectors.toList());
    }

    private ResenaResponseDTO toDto(Resena r) {
        return new ResenaResponseDTO(
                r.getId(),
                r.getUsuario().getId(),
                r.getItemId(),
                r.getTipo(),
                r.getContenido(),
                r.getPuntuacion(),
                r.getFechaCreacion(),
                r.getImagenUrl()
        );
    }
}
