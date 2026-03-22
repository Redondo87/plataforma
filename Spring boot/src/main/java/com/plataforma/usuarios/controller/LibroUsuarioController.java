package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.model.LibroUsuario;
import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.model.dto.LibroUsuarioDTO;
import com.plataforma.usuarios.model.repository.LibroUsuarioRepository;
import com.plataforma.usuarios.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigInteger;
import java.util.*;

@RestController
@RequestMapping("/api/libros-usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class LibroUsuarioController {

    @Autowired
    private LibroUsuarioRepository libroUsuarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RestTemplate restTemplate;

    // ------------------------------------------------------------------------
    // GUARDAR O ACTUALIZAR LIBRO
    // ------------------------------------------------------------------------
    @PostMapping
    public LibroUsuario agregarLibro(@RequestBody LibroUsuarioDTO dto) {

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 🔥 Buscar si ya existe
        LibroUsuario libroUsuario = libroUsuarioRepository
                .findByUsuario_IdAndLibroId(dto.getUsuarioId(), dto.getLibroId())
                .orElse(new LibroUsuario());

        libroUsuario.setUsuario(usuario);
        libroUsuario.setLibroId(dto.getLibroId());
        libroUsuario.setEstado(dto.getEstado());
        libroUsuario.setPuntuacion(dto.getPuntuacion());

        return libroUsuarioRepository.save(libroUsuario);
    }

    // ------------------------------------------------------------------------
    // OBTENER LIBRO CONCRETO DE UN USUARIO
    // ------------------------------------------------------------------------
    @GetMapping("/usuario/{usuarioId}/libro/{libroId}")
    public LibroUsuario obtenerPorUsuarioYLibro(
            @PathVariable Long usuarioId,
            @PathVariable String libroId) {

        return libroUsuarioRepository
                .findByUsuario_IdAndLibroId(usuarioId, libroId)
                .orElse(null);
    }

    // ------------------------------------------------------------------------
    // TOP LIBROS
    // ------------------------------------------------------------------------
    @GetMapping("/top")
    public List<Map<String, Object>> obtenerTopLibros(
            @RequestParam(required = false) Long usuarioId) {

        List<Object[]> top = libroUsuarioRepository.findTopRatedByLibroId();

        List<LibroUsuario> librosUsuario = usuarioId != null
                ? libroUsuarioRepository.findByUsuario_Id(usuarioId)
                : List.of();

        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Object[] fila : top) {

            String libroId = (String) fila[0];
            Double promedioInterno = (Double) fila[1];

            Long votos;
            Object valor = fila[2];
            if (valor instanceof Long l) votos = l;
            else if (valor instanceof BigInteger b) votos = b.longValue();
            else votos = 0L;

            Map<String, Object> infoLibro = obtenerInfoLibroDesdeGoogleBooks(libroId);

            Double ratingExterno5 = (Double) infoLibro.get("ratingExterno");
            Integer ratingsExternos = (Integer) infoLibro.get("ratingsCountExterno");

            Double ratingExterno10 = null;
            if (ratingExterno5 != null) {
                ratingExterno10 = ratingExterno5 * 2.0;
            }

            Double puntuacionFinal;
            if (ratingExterno10 != null && promedioInterno != null) {
                puntuacionFinal = ratingExterno10 * 0.7 + promedioInterno * 0.3;
            } else if (ratingExterno10 != null) {
                puntuacionFinal = ratingExterno10;
            } else if (promedioInterno != null) {
                puntuacionFinal = promedioInterno;
            } else {
                puntuacionFinal = 0.0;
            }

            Integer miPuntuacion = librosUsuario.stream()
                    .filter(reg -> reg.getLibroId().equals(libroId))
                    .map(LibroUsuario::getPuntuacion)
                    .findFirst()
                    .orElse(null);

            Map<String, Object> mapa = new HashMap<>();
            mapa.put("libroId", libroId);
            mapa.put("titulo", infoLibro.get("titulo"));
            mapa.put("imagen", infoLibro.get("imagen"));
            mapa.put("promedio", puntuacionFinal);
            mapa.put("miPuntuacion", miPuntuacion != null ? miPuntuacion : 0);
            mapa.put("ranking", 0);

            resultado.add(mapa);
        }

        resultado.sort((a, b) -> {
            Double pa = ((Number) a.getOrDefault("promedio", 0)).doubleValue();
            Double pb = ((Number) b.getOrDefault("promedio", 0)).doubleValue();
            return Double.compare(pb, pa);
        });

        int ranking = 1;
        for (Map<String, Object> libro : resultado) {
            libro.put("ranking", ranking++);
        }

        return resultado;
    }

    // ------------------------------------------------------------------------
    // GOOGLE BOOKS
    // ------------------------------------------------------------------------
    private Map<String, Object> obtenerInfoLibroDesdeGoogleBooks(String libroId) {

        Map<String, Object> info = new HashMap<>();
        info.put("titulo", "Título no disponible");
        info.put("imagen", "/assets/images/imagenNoDisponible.png");
        info.put("ratingExterno", null);
        info.put("ratingsCountExterno", null);

        try {
            String url = "https://www.googleapis.com/books/v1/volumes/" + libroId +
                    "?fields=volumeInfo(title,imageLinks/thumbnail,averageRating,ratingsCount)";

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("volumeInfo")) {
                Map<String, Object> volumeInfo =
                        (Map<String, Object>) response.get("volumeInfo");

                if (volumeInfo.get("title") != null) {
                    info.put("titulo", volumeInfo.get("title").toString());
                }

                if (volumeInfo.containsKey("imageLinks")) {
                    Map<String, Object> imageLinks =
                            (Map<String, Object>) volumeInfo.get("imageLinks");
                    if (imageLinks.get("thumbnail") != null) {
                        info.put("imagen", imageLinks.get("thumbnail").toString());
                    }
                }

                if (volumeInfo.get("averageRating") instanceof Number num) {
                    info.put("ratingExterno", num.doubleValue());
                }

                if (volumeInfo.get("ratingsCount") instanceof Number num2) {
                    info.put("ratingsCountExterno", num2.intValue());
                }
            }

        } catch (Exception e) {
            System.out.println("Error Google Books: " + e.getMessage());
        }

        return info;
    }
}