package com.plataforma.usuarios.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RecomendacionesService {

    @Value("${google.books.key:}")
    private String googleBooksKey;

    @Value("${tmdb.key:}")
    private String tmdbKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ================= LIBROS =================
    public ResponseEntity<String> getLibrosRecomendados() {

        if (googleBooksKey == null || googleBooksKey.isBlank()) {
            return okEmpty();
        }

        String url =
                "https://www.googleapis.com/books/v1/volumes" +
                "?q=novela" +
                "&langRestrict=es" +
                "&orderBy=relevance" +
                "&maxResults=12" +
                "&key=" + googleBooksKey;

        return safeForward(url);
    }

    // ================= PELÍCULAS =================
    public ResponseEntity<String> getPeliculasRecomendadas() {

        if (tmdbKey == null || tmdbKey.isBlank()) {
            return okEmpty();
        }

        String url =
                "https://api.themoviedb.org/3/trending/movie/week" +
                "?api_key=" + tmdbKey +
                "&language=es-ES";

        return safeForward(url);
    }

    // ================= SERIES =================
    public ResponseEntity<String> getSeriesRecomendadas() {

        if (tmdbKey == null || tmdbKey.isBlank()) {
            return okEmpty();
        }

        String url =
                "https://api.themoviedb.org/3/trending/tv/week" +
                "?api_key=" + tmdbKey +
                "&language=es-ES";

        return safeForward(url);
    }

    // ================= SEARCH MULTI =================
    public ResponseEntity<String> searchMulti(String query) {

        if (tmdbKey == null || tmdbKey.isBlank()) {
            return okEmpty();
        }

        String url =
                "https://api.themoviedb.org/3/search/multi" +
                "?api_key=" + tmdbKey +
                "&language=es-ES" +
                "&query=" + query +
                "&page=1" +
                "&include_adult=false";

        return safeForward(url);
    }

    // ================= DISCOVER MOVIES =================
    public ResponseEntity<String> discoverMoviesByGenre(Integer genreId) {

        if (tmdbKey == null || tmdbKey.isBlank()) {
            return okEmpty();
        }

        String url =
                "https://api.themoviedb.org/3/discover/movie" +
                "?api_key=" + tmdbKey +
                "&with_genres=" + genreId +
                "&language=es-ES";

        return safeForward(url);
    }

    // ================= DISCOVER TV =================
    public ResponseEntity<String> discoverTvByGenre(Integer genreId) {

        if (tmdbKey == null || tmdbKey.isBlank()) {
            return okEmpty();
        }

        String url =
                "https://api.themoviedb.org/3/discover/tv" +
                "?api_key=" + tmdbKey +
                "&with_genres=" + genreId +
                "&language=es-ES";

        return safeForward(url);
    }

    // ================= GENRES MOVIES =================
    public ResponseEntity<String> getMovieGenres() {

        if (tmdbKey == null || tmdbKey.isBlank()) {
            return okEmpty();
        }

        String url =
                "https://api.themoviedb.org/3/genre/movie/list" +
                "?api_key=" + tmdbKey +
                "&language=es-ES";

        return safeForward(url);
    }

    // ================= GENRES TV =================
    public ResponseEntity<String> getTvGenres() {

        if (tmdbKey == null || tmdbKey.isBlank()) {
            return okEmpty();
        }

        String url =
                "https://api.themoviedb.org/3/genre/tv/list" +
                "?api_key=" + tmdbKey +
                "&language=es-ES";

        return safeForward(url);
    }

    // ================= MÉTODO SEGURO =================
    private ResponseEntity<String> safeForward(String url) {
        try {
            ResponseEntity<String> response =
                    restTemplate.getForEntity(url, String.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return okEmpty();
        }
    }

    // ================= RESPUESTA VACÍA =================
    private ResponseEntity<String> okEmpty() {
        return ResponseEntity.ok("{\"results\":[]}");
    }
}