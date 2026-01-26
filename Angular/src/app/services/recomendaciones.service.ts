import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface RecomendacionLibro {
  id: string;
  titulo: string;
  autores: string;
  imagen: string;
  anio?: number;
}

export interface RecomendacionMedia {
  id: number;
  titulo: string;
  tipo: 'serie' | 'pelicula';
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class RecomendacionesService {

  private googleApiKey = 'AIzaSyACE882Krrh-9OQQFSddSDjzvbDyQZYZOg';
  private tmdbApiKey = '218315c8512d576a1f186b27b8d7538e';

  constructor(private http: HttpClient) {}

  /* =========================
        RECOMENDACIONES LIBROS
     ========================= */
  getLibrosRecomendados(): Observable<RecomendacionLibro[]> {

    // 🔥 Búsqueda simple y efectiva
    const q = encodeURIComponent('libro recomendado');

    const url =
      `https://www.googleapis.com/books/v1/volumes?q=${q}` +
      `&orderBy=newest` +
      `&printType=books` +
      `&langRestrict=es` +
      `&maxResults=40` +
      `&key=${this.googleApiKey}`;

    const anioMinimo = new Date().getFullYear() - 5; // últimos 5 años

    return this.http.get<any>(url).pipe(
      map((res: any) => {
        const items: any[] = res?.items ?? [];
        if (!items.length) return [];

        const libros = items.map((it: any) => {
          const info = it.volumeInfo ?? {};
          const fecha = info.publishedDate;
          const anio = fecha ? parseInt(fecha.substring(0, 4), 10) : undefined;

          return {
            id: it.id,
            titulo: info.title ?? 'Sin título',
            autores: (info.authors ?? []).join(', ') || 'Autor desconocido',
            imagen:
              info.imageLinks?.thumbnail ||
              info.imageLinks?.smallThumbnail ||
              '/assets/images/imagenNoDisponible.png',
            anio
          } as RecomendacionLibro;
        });

        // 🔥 Priorizamos libros recientes, pero nunca dejamos vacío
        const recientes = libros.filter(
          l => l.anio && l.anio >= anioMinimo
        );

        const resultado = recientes.length ? recientes : libros;

        return resultado.slice(0, 24);
      })
    );
  }

  /* =========================
     RECOMENDACIONES PELÍCULAS
     ========================= */
  getTrendingPeliculas(): Observable<RecomendacionMedia[]> {
    const url =
      `https://api.themoviedb.org/3/trending/movie/week` +
      `?api_key=${this.tmdbApiKey}&language=es`;

    return this.http.get<any>(url).pipe(
      map((res: any) =>
        (res.results ?? []).slice(0, 24).map((x: any) => ({
          id: x.id,
          titulo: x.title ?? 'Sin título',
          tipo: 'pelicula',
          imagen: x.poster_path
            ? `https://image.tmdb.org/t/p/w500${x.poster_path}`
            : '/assets/images/imagenNoDisponible.png'
        }))
      )
    );
  }

  /* =========================
        RECOMENDACIONES SERIES
     ========================= */
  getTrendingSeries(): Observable<RecomendacionMedia[]> {
    const url =
      `https://api.themoviedb.org/3/trending/tv/week` +
      `?api_key=${this.tmdbApiKey}&language=es`;

    return this.http.get<any>(url).pipe(
      map((res: any) =>
        (res.results ?? []).slice(0, 24).map((x: any) => ({
          id: x.id,
          titulo: x.name ?? 'Sin título',
          tipo: 'serie',
          imagen: x.poster_path
            ? `https://image.tmdb.org/t/p/w500${x.poster_path}`
            : '/assets/images/imagenNoDisponible.png'
        }))
      )
    );
  }
}
