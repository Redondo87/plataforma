package com.plataforma.usuarios.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RecomendacionesService {

    @Value("${google.books.key}")
    private String googleBooksKey;

    @Value("${tmdb.key}")
    private String tmdbKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // --- LIBROS ---
    public String getLibrosRecomendados() {
        String url =
            "https://www.googleapis.com/books/v1/volumes" +
            "?q=subject:fiction" +
            "&langRestrict=es" +
            "&maxResults=24" +
            "&key=" + googleBooksKey;

        return restTemplate.getForObject(url, String.class);
    }

    // --- PELÍCULAS ---
    public String getPeliculasRecomendadas() {
        String url =
            "https://api.themoviedb.org/3/trending/movie/week" +
            "?api_key=" + tmdbKey +
            "&language=es";

        return restTemplate.getForObject(url, String.class);
    }

    // --- SERIES ---
    public String getSeriesRecomendadas() {
        String url =
            "https://api.themoviedb.org/3/trending/tv/week" +
            "?api_key=" + tmdbKey +
            "&language=es";

        return restTemplate.getForObject(url, String.class);
    }
}
