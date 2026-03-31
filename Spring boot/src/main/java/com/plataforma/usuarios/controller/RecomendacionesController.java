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

    // ---------------- LIBROS ----------------
    @GetMapping(value = "/libros", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> libros() {
        return recomendacionesService.getLibrosRecomendados();
    }

    // ---------------- PELÍCULAS TRENDING ----------------
    @GetMapping(value = "/peliculas", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> peliculas() {
        return recomendacionesService.getPeliculasRecomendadas();
    }

    // ---------------- SERIES TRENDING ----------------
    @GetMapping(value = "/series", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> series() {
        return recomendacionesService.getSeriesRecomendadas();
    }

    // ================= NUEVOS ENDPOINTS TMDB =================

    // 🔎 SEARCH MULTI
    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> search(@RequestParam String query) {
        return recomendacionesService.searchMulti(query);
    }

    // 🎬 DISCOVER MOVIES BY GENRE
    @GetMapping(value = "/discover/movies", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> discoverMovies(@RequestParam Integer genreId) {
        return recomendacionesService.discoverMoviesByGenre(genreId);
    }

    // 📺 DISCOVER TV BY GENRE
    @GetMapping(value = "/discover/tv", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> discoverTv(@RequestParam Integer genreId) {
        return recomendacionesService.discoverTvByGenre(genreId);
    }

    // 🎭 MOVIE GENRES
    @GetMapping(value = "/genres/movies", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> movieGenres() {
        return recomendacionesService.getMovieGenres();
    }

    // 📚 TV GENRES
    @GetMapping(value = "/genres/tv", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> tvGenres() {
        return recomendacionesService.getTvGenres();
    }
}