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
    // GUARDAR LIBRO DE UN USUARIO
    // ------------------------------------------------------------------------
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

    // ------------------------------------------------------------------------
    // TOP LIBROS – mezcla 70% Google Books, 30% media de tus usuarios
    // ------------------------------------------------------------------------
    @GetMapping("/top")
    public List<Map<String, Object>> obtenerTopLibros(
            @RequestParam(required = false) Long usuarioId) {

        // Media de puntuaciones de TODOS tus usuarios por libro
        List<Object[]> top = libroUsuarioRepository.findTopRatedByLibroId();

        // Todos los registros del usuario logueado (si llega usuarioId)
        List<LibroUsuario> librosUsuario = usuarioId != null
                ? libroUsuarioRepository.findByUsuarioId(usuarioId)
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

            // 🔹 Puntuación EXTERNA desde Google Books
            Map<String, Object> infoLibro = obtenerInfoLibroDesdeGoogleBooks(libroId);
            Double ratingExterno5 = (Double) infoLibro.get("ratingExterno");        // 0–5
            Integer ratingsExternos = (Integer) infoLibro.get("ratingsCountExterno");

            Double ratingExterno10 = null;
            if (ratingExterno5 != null) {
                ratingExterno10 = ratingExterno5 * 2.0;                            // 0–10
            }

            // 🔹 Puntuación final MIXTA (opción C)
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

            // 🔹 Puntuación del usuario actual (columna “Tu puntuación”)
            Integer miPuntuacion = librosUsuario.stream()
                    .filter(reg -> reg.getLibroId().equals(libroId))
                    .map(LibroUsuario::getPuntuacion)
                    .findFirst()
                    .orElse(null);

            Map<String, Object> mapa = new HashMap<>();
            mapa.put("libroId", libroId);
            mapa.put("titulo", infoLibro.get("titulo"));
            mapa.put("imagen", infoLibro.get("imagen"));

            // SE USA EN EL FRONT: columna “Puntuación promedio”
            mapa.put("promedio", puntuacionFinal);

            // Info extra por si la quieres usar luego
            mapa.put("promedioInterno", promedioInterno);
            mapa.put("ratingExterno", ratingExterno10);
            mapa.put("votosUsuarios", votos);
            mapa.put("votosExternos", ratingsExternos);

            // Columna "Tu puntuación"
            mapa.put("miPuntuacion", miPuntuacion != null ? miPuntuacion : 0);

            resultado.add(mapa);
        }

        // Ordenar de mayor a menor según la puntuación MIXTA
        resultado.sort((a, b) -> {
            Double pa = ((Number) a.getOrDefault("promedio", 0)).doubleValue();
            Double pb = ((Number) b.getOrDefault("promedio", 0)).doubleValue();
            return Double.compare(pb, pa);
        });

        // Asignar ranking 1,2,3,...
        int ranking = 1;
        for (Map<String, Object> libro : resultado) {
            libro.put("ranking", ranking++);
        }

        return resultado;
    }

    // ------------------------------------------------------------------------
    // Google Books: título, imagen, PUNTUACIÓN EXTERNA
    // ------------------------------------------------------------------------
    private Map<String, Object> obtenerInfoLibroDesdeGoogleBooks(String libroId) {

        Map<String, Object> info = new HashMap<>();
        info.put("titulo", "Título no disponible");
        info.put("imagen", "/assets/images/imagenNoDisponible.png");
        info.put("ratingExterno", null);
        info.put("ratingsCountExterno", null);

        if (libroId == null || libroId.isBlank()) return info;

        try {
            String url = "https://www.googleapis.com/books/v1/volumes/" + libroId +
                    "?fields=volumeInfo(title,imageLinks/thumbnail,averageRating,ratingsCount)";

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("volumeInfo")) {
                Map<String, Object> volumeInfo =
                        (Map<String, Object>) response.get("volumeInfo");

                Object titleObj = volumeInfo.get("title");
                if (titleObj != null) {
                    info.put("titulo", titleObj.toString());
                }

                if (volumeInfo.containsKey("imageLinks")) {
                    Map<String, Object> imageLinks =
                            (Map<String, Object>) volumeInfo.get("imageLinks");
                    Object thumb = imageLinks.get("thumbnail");
                    if (thumb != null) {
                        info.put("imagen", thumb.toString());
                    }
                }

                Object avgObj = volumeInfo.get("averageRating");
                if (avgObj instanceof Number num) {
                    info.put("ratingExterno", num.doubleValue()); // 0–5
                }

                Object cntObj = volumeInfo.get("ratingsCount");
                if (cntObj instanceof Number num2) {
                    info.put("ratingsCountExterno", num2.intValue());
                }
            }

        } catch (Exception e) {
            System.out.println("❌ Error consultando Google Books: " + e.getMessage());
        }

        return info;
    }
}
