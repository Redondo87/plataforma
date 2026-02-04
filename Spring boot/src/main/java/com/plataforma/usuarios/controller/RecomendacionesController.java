package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.service.RecomendacionesService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recomendaciones")
@CrossOrigin(origins = "http://localhost:4200")
public class RecomendacionesController {

    private final RecomendacionesService recomendacionesService;

    public RecomendacionesController(RecomendacionesService recomendacionesService) {
        this.recomendacionesService = recomendacionesService;
    }

    // 📚 LIBROS
    @GetMapping("/libros")
    public String libros() {
        return recomendacionesService.getLibrosRecomendados();
    }

    // 🎬 PELÍCULAS
    @GetMapping("/peliculas")
    public String peliculas() {
        return recomendacionesService.getPeliculasRecomendadas();
    }

    // 📺 SERIES
    @GetMapping("/series")
    public String series() {
        return recomendacionesService.getSeriesRecomendadas();
    }
}
