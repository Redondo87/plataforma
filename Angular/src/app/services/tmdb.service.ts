import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TmdbService {

  private API_URL = 'https://api.themoviedb.org/3';
  private API_KEY = 'TU_API_KEY_DE_TMDB'; // la que ya usas

  constructor(private http: HttpClient) {}

  // 🎬 Próximos estrenos
  upcomingMovies(limit = 5): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/movie/upcoming`, {
      params: {
        api_key: this.API_KEY,
        language: 'es-ES'
      }
    }).pipe(
      map(resp =>
        (resp.results ?? []).slice(0, limit).map((m: any) => ({
          id: m.id,
          titulo: m.title,
          fecha: m.release_date,
          imagen: m.poster_path
            ? 'https://image.tmdb.org/t/p/w200' + m.poster_path
            : '/assets/images/imagenNoDisponible.png'
        }))
      )
    );
  }

  // 📺 Series hoy
  airingTodaySeries(limit = 5): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/tv/airing_today`, {
      params: {
        api_key: this.API_KEY,
        language: 'es-ES'
      }
    }).pipe(
      map(resp =>
        (resp.results ?? []).slice(0, limit).map((s: any) => ({
          id: s.id,
          titulo: s.name,
          fecha: s.first_air_date,
          imagen: s.poster_path
            ? 'https://image.tmdb.org/t/p/w200' + s.poster_path
            : '/assets/images/imagenNoDisponible.png'
        }))
      )
    );
  }
}
