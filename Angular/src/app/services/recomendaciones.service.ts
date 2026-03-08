import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface RecomendacionLibro {
  id: string;
  titulo: string;
  autores: string;
  imagen: string;
}

export interface RecomendacionMedia {
  id: number;
  titulo: string;
  tipo: 'serie' | 'pelicula';
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class RecomendacionesService {
  private apiBase = 'http://localhost:8080/api/recomendaciones';

  constructor(private http: HttpClient) {}

  // LIBROS 
  getLibrosRecomendados(): Observable<RecomendacionLibro[]> {
    return this.http.get<any>(`${this.apiBase}/libros`).pipe(
      map((res: any) => (res?.items ?? []).map((it: any) => {
        const info = it?.volumeInfo ?? {};
        return {
          id: it?.id,
          titulo: info?.title ?? 'Sin título',
          autores: (info?.authors ?? []).join(', ') || 'Autor desconocido',
          imagen: info?.imageLinks?.thumbnail
            || info?.imageLinks?.smallThumbnail
            || '/assets/images/imagenNoDisponible.png'
        } as RecomendacionLibro;
      }).slice(0, 24))
    );
  }

  //  PELÍCULAS 
  getTrendingPeliculas(): Observable<RecomendacionMedia[]> {
    return this.http.get<any>(`${this.apiBase}/peliculas`).pipe(
      map((res: any) => (res?.results ?? []).slice(0, 24).map((x: any) => ({
        id: x?.id,
        titulo: x?.title ?? 'Sin título',
        tipo: 'pelicula',
        imagen: x?.poster_path
          ? `https://image.tmdb.org/t/p/w500${x.poster_path}`
          : '/assets/images/imagenNoDisponible.png'
      } as RecomendacionMedia)))
    );
  }

  // SERIES 
  getTrendingSeries(): Observable<RecomendacionMedia[]> {
    return this.http.get<any>(`${this.apiBase}/series`).pipe(
      map((res: any) => (res?.results ?? []).slice(0, 24).map((x: any) => ({
        id: x?.id,
        titulo: x?.name ?? 'Sin título',
        tipo: 'serie',
        imagen: x?.poster_path
          ? `https://image.tmdb.org/t/p/w500${x.poster_path}`
          : '/assets/images/imagenNoDisponible.png'
      } as RecomendacionMedia)))
    );
  }
}
