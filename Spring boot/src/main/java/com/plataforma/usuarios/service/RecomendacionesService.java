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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\":\"GOOGLE_BOOKS_API_KEY missing\"}");
        }

        String url =
                "https://www.googleapis.com/books/v1/volumes" +
                        "?q=subject:fiction" +
                        "&langRestrict=es" +
                        "&maxResults=24" +
                        "&key=" + googleBooksKey;

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
                    .body("{\"error\":\"Backend error\",\"detail\":\"" + e.getMessage().replace("\"","'") + "\"}");
        }
    }

    // ---------------- PELÍCULAS ----------------
    public ResponseEntity<String> getPeliculasRecomendadas() {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\":\"TMDB_API_KEY missing\"}");
        }

        String url =
                "https://api.themoviedb.org/3/trending/movie/week" +
                        "?api_key=" + tmdbKey +
                        "&language=es-ES";

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
                    .body("{\"error\":\"Backend error\",\"detail\":\"" + e.getMessage().replace("\"","'") + "\"}");
        }
    }

    // ---------------- SERIES ----------------
    public ResponseEntity<String> getSeriesRecomendadas() {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\":\"TMDB_API_KEY missing\"}");
        }

        String url =
                "https://api.themoviedb.org/3/trending/tv/week" +
                        "?api_key=" + tmdbKey +
                        "&language=es-ES";

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
                    .body("{\"error\":\"Backend error\",\"detail\":\"" + e.getMessage().replace("\"","'") + "\"}");
        }
    }
}
