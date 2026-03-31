package com.plataforma.usuarios.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@Service
public class RecomendacionesService {

    @Value("${google.books.key:}")
    private String googleBooksKey;

    @Value("${tmdb.key:}")
    private String tmdbKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ---------------- LIBROS ----------------
    public ResponseEntity<String> getLibrosRecomendados() {
        if (googleBooksKey == null || googleBooksKey.isBlank()) {
            return error("GOOGLE_BOOKS_API_KEY missing");
        }

        String url =
                "https://www.googleapis.com/books/v1/volumes" +
                        "?q=subject:fiction" +
                        "&langRestrict=es" +
                        "&maxResults=24" +
                        "&key=" + googleBooksKey;

        return forward(url);
    }

    // ---------------- PELÍCULAS TRENDING ----------------
    public ResponseEntity<String> getPeliculasRecomendadas() {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String url =
                "https://api.themoviedb.org/3/trending/movie/week" +
                        "?api_key=" + tmdbKey +
                        "&language=es-ES";

        return forward(url);
    }

    // ---------------- SERIES TRENDING ----------------
    public ResponseEntity<String> getSeriesRecomendadas() {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String url =
                "https://api.themoviedb.org/3/trending/tv/week" +
                        "?api_key=" + tmdbKey +
                        "&language=es-ES";

        return forward(url);
    }

    // ================= NUEVO: SEARCH MULTI =================
    public ResponseEntity<String> searchMulti(String query) {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String url =
                "https://api.themoviedb.org/3/search/multi" +
                        "?api_key=" + tmdbKey +
                        "&language=es-ES" +
                        "&query=" + query +
                        "&page=1" +
                        "&include_adult=false";

        return forward(url);
    }

    // ================= NUEVO: DISCOVER MOVIES =================
    public ResponseEntity<String> discoverMoviesByGenre(Integer genreId) {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String url =
                "https://api.themoviedb.org/3/discover/movie" +
                        "?api_key=" + tmdbKey +
                        "&with_genres=" + genreId +
                        "&language=es-ES";

        return forward(url);
    }

    // ================= NUEVO: DISCOVER TV =================
    public ResponseEntity<String> discoverTvByGenre(Integer genreId) {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String url =
                "https://api.themoviedb.org/3/discover/tv" +
                        "?api_key=" + tmdbKey +
                        "&with_genres=" + genreId +
                        "&language=es-ES";

        return forward(url);
    }

    // ================= NUEVO: GENRES MOVIES =================
    public ResponseEntity<String> getMovieGenres() {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String url =
                "https://api.themoviedb.org/3/genre/movie/list" +
                        "?api_key=" + tmdbKey +
                        "&language=es-ES";

        return forward(url);
    }

    // ================= NUEVO: GENRES TV =================
    public ResponseEntity<String> getTvGenres() {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String url =
                "https://api.themoviedb.org/3/genre/tv/list" +
                        "?api_key=" + tmdbKey +
                        "&language=es-ES";

        return forward(url);
    }

    // ================= HELPERS =================

    private ResponseEntity<String> error(String message) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"error\":\"" + message + "\"}");
    }

    private ResponseEntity<String> forward(String url) {
        try {
            ResponseEntity<String> resp = restTemplate.getForEntity(url, String.class);
            return ResponseEntity.status(resp.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(resp.getBody());
        } catch (HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\":\"Backend error\"}");
        }
    }
}