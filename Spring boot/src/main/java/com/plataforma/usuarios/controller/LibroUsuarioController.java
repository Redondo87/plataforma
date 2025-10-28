package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.model.LibroUsuario;
import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.model.dto.LibroUsuarioDTO;
import com.plataforma.usuarios.model.repository.LibroUsuarioRepository;
import com.plataforma.usuarios.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/libros-usuarios")
public class LibroUsuarioController {

    @Autowired
    private LibroUsuarioRepository libroUsuarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping
    public LibroUsuario agregarLibro(@RequestBody LibroUsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        LibroUsuario libroUsuario = new LibroUsuario();
        libroUsuario.setUsuario(usuario);
        libroUsuario.setLibroId(dto.getLibroId());
        libroUsuario.setEstado(dto.getEstado());
        libroUsuario.setPuntuacion(dto.getPuntuacion());

        return libroUsuarioRepository.save(libroUsuario);
    }

    @GetMapping("/top")
    public List<Map<String, Object>> obtenerTopLibros(@RequestParam(required = false) Long usuarioId) {
        List<Object[]> top = libroUsuarioRepository.findTopRatedByLibroId();
        List<Map<String, Object>> resultado = new ArrayList<>();
        int ranking = 1;

        List<LibroUsuario> librosUsuario = usuarioId != null
                ? libroUsuarioRepository.findByUsuarioId(usuarioId)
                : List.of();

        for (Object[] obj : top) {
            String libroId = (String) obj[0];
            Double promedio = (Double) obj[1];
            Long votos = (Long) obj[2];

            Integer miPuntuacion = null;
            for (LibroUsuario reg : librosUsuario) {
                if (reg.getLibroId().equals(libroId)) {
                    miPuntuacion = reg.getPuntuacion();
                    break;
                }
            }

            Map<String, String> infoLibro = obtenerInfoLibroDesdeGoogleBooks(libroId);

            Map<String, Object> mapa = new HashMap<>();
            mapa.put("ranking", ranking++);
            mapa.put("libroId", libroId);
            mapa.put("titulo", infoLibro.getOrDefault("titulo", "Título no disponible"));
            mapa.put("imagen", infoLibro.getOrDefault("imagen", "/assets/images/imagenNoDisponible.png"));
            mapa.put("promedio", promedio);
            mapa.put("miPuntuacion", miPuntuacion != null ? miPuntuacion : 0);

            resultado.add(mapa);
        }

        return resultado;
    }

    private Map<String, String> obtenerInfoLibroDesdeGoogleBooks(String libroId) {
        Map<String, String> info = new HashMap<>();
        info.put("titulo", "Título no disponible");
        info.put("imagen", "/assets/images/imagenNoDisponible.png");

        if (libroId == null || libroId.isEmpty()) return info;

        try {
            String url = "https://www.googleapis.com/books/v1/volumes/" + libroId;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("volumeInfo")) {
                Map<String, Object> volumeInfo = (Map<String, Object>) response.get("volumeInfo");
                info.put("titulo", volumeInfo.getOrDefault("title", "Título no disponible").toString());

                if (volumeInfo.containsKey("imageLinks")) {
                    Map<String, Object> imageLinks = (Map<String, Object>) volumeInfo.get("imageLinks");
                    if (imageLinks.get("thumbnail") != null)
                        info.put("imagen", imageLinks.get("thumbnail").toString());
                }
            }
        } catch (Exception e) {
            System.out.println("Error obteniendo info para " + libroId + ": " + e.getMessage());
        }

        return info;
    }
}
