package com.plataforma.usuarios.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/external")
@CrossOrigin(origins = "http://localhost:4200")
public class ExternalApisController {

    @Value("${google.books.key:}")
    private String googleBooksKey;

    @Value("${tmdb.key:}")
    private String tmdbKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ================= GOOGLE BOOKS =================

    @GetMapping(value = "/books/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> searchBooks(@RequestParam("q") String q) {
        if (googleBooksKey == null || googleBooksKey.isBlank()) {
            return error("GOOGLE_BOOKS_API_KEY missing");
        }

        String query = URLEncoder.encode(q, StandardCharsets.UTF_8);
        String url = "https://www.googleapis.com/books/v1/volumes"
                + "?q=" + query
                + "&langRestrict=es"
                + "&maxResults=40"
                + "&key=" + googleBooksKey;

        return forward(url);
    }

    @GetMapping(value = "/books/volumes/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> bookDetail(@PathVariable String id) {
        if (googleBooksKey == null || googleBooksKey.isBlank()) {
            return error("GOOGLE_BOOKS_API_KEY missing");
        }

        String url = "https://www.googleapis.com/books/v1/volumes/" + id
                + "?langRestrict=es"
                + "&key=" + googleBooksKey;

        return forward(url);
    }

    // ================= TMDB =================

    @GetMapping(value = "/tmdb/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> tmdbSearch(@RequestParam("query") String query) {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String q = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String url = "https://api.themoviedb.org/3/search/multi"
                + "?query=" + q
                + "&api_key=" + tmdbKey
                + "&language=es-ES";

        return forward(url);
    }

    // 🔹 DETALLE dinámico (tv o movie)
    @GetMapping(value = "/tmdb/detail", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> tmdbDetail(
            @RequestParam("tipo") String tipo,
            @RequestParam("id") String id,
            @RequestParam(defaultValue = "es-ES") String language
    ) {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String url = "https://api.themoviedb.org/3/" + tipo + "/" + id
                + "?api_key=" + tmdbKey
                + "&language=" + language;

        return forward(url);
    }

    // 🔹 WATCH PROVIDERS
    @GetMapping(value = "/tmdb/watch-providers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> tmdbWatchProviders(
            @RequestParam("tipo") String tipo,
            @RequestParam("id") String id
    ) {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String url = "https://api.themoviedb.org/3/" + tipo + "/" + id
                + "/watch/providers"
                + "?api_key=" + tmdbKey;

        return forward(url);
    }

    // 🔹 TOP RATED TV
    @GetMapping(value = "/tmdb/top-rated-tv", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> tmdbTopRatedTv(
            @RequestParam(defaultValue = "es-ES") String language
    ) {
        if (tmdbKey == null || tmdbKey.isBlank()) {
            return error("TMDB_API_KEY missing");
        }

        String url = "https://api.themoviedb.org/3/tv/top_rated"
                + "?api_key=" + tmdbKey
                + "&language=" + language;

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