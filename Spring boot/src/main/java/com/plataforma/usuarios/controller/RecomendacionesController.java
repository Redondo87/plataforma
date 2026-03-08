package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.service.RecomendacionesService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recomendaciones")
@CrossOrigin(origins = "http://localhost:4200")
public class RecomendacionesController {

    private final RecomendacionesService recomendacionesService;

    public RecomendacionesController(RecomendacionesService recomendacionesService) {
        this.recomendacionesService = recomendacionesService;
    }

    @GetMapping(value = "/libros", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> libros() {
        return recomendacionesService.getLibrosRecomendados();
    }

    @GetMapping(value = "/peliculas", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> peliculas() {
        return recomendacionesService.getPeliculasRecomendadas();
    }

    @GetMapping(value = "/series", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> series() {
        return recomendacionesService.getSeriesRecomendadas();
    }
}
