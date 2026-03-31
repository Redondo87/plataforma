import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TmdbService {

  private API_URL = 'http://localhost:8080/api/recomendaciones';

  constructor(private http: HttpClient) {}

  // ⭐ TOP 5 PELÍCULAS
  topRatedMovies(limit = 5): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/peliculas`)
      .pipe(
        map(resp =>
          (resp.results ?? []).slice(0, limit).map((m: any) => ({
            id: m.id,
            titulo: m.title,
            imagen: m.poster_path
              ? 'https://image.tmdb.org/t/p/w200' + m.poster_path
              : '/assets/images/imagenNoDisponible.png',
            puntuacion: m.vote_average
          }))
        )
      );
  }

  // ⭐ TOP 5 SERIES
  topRatedSeries(limit = 5): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/series`)
      .pipe(
        map(resp =>
          (resp.results ?? []).slice(0, limit).map((s: any) => ({
            id: s.id,
            titulo: s.name,
            imagen: s.poster_path
              ? 'https://image.tmdb.org/t/p/w200' + s.poster_path
              : '/assets/images/imagenNoDisponible.png',
            puntuacion: s.vote_average
          }))
        )
      );
  }

}