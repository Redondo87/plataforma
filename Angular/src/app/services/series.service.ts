import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SeriesService { 

  private API_URL = 'https://api.themoviedb.org/3';
  private API_KEY = '218315c8512d576a1f186b27b8d7538e';
  private apiUrlUsuarios = 'http://localhost:8080/api/series-usuarios';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener detalle de una serie/película
  obtenerDetalle(tipo: 'tv' | 'movie', id: string): Observable<any> {
    const detalle$ = this.http.get<any>(`${this.API_URL}/${tipo}/${id}`, {
      params: { api_key: this.API_KEY, language: 'es' }
    });

    const proveedores$ = this.http.get<any>(`${this.API_URL}/${tipo}/${id}/watch/providers`, {
      params: { api_key: this.API_KEY }
    });

    return forkJoin({ detalle: detalle$, proveedores: proveedores$ }).pipe(
      map(({ detalle, proveedores }) => {
        const region = proveedores?.results?.['ES'];
        const streamingProviders = region?.flatrate || [];
        return { ...detalle, streamingProviders };
      })
    );
  }

  // 🔹 Obtener top series (TMDB)
  obtenerMejoresSeries(): Observable<any[]> {
    return this.http.get<any>(`${this.API_URL}/tv/top_rated`, {
      params: { api_key: this.API_KEY, language: 'es' }
    }).pipe(
      map((resp: any) =>
        resp.results.map((s: any, index: number) => ({
          id: s.id,
          titulo: s.name,
          imagen: s.poster_path 
            ? 'https://image.tmdb.org/t/p/w200' + s.poster_path 
            : '/assets/images/imagenNoDisponible.png',
          promedio: s.vote_average,
          ranking: index + 1
        }))
      )
    );
  }

  // 🔹 Obtener series/películas guardadas por el usuario
  obtenerSeriesUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlUsuarios}/usuario/${usuarioId}`);
  }

  // 🔹 Guardar serie/película
  guardarSerieUsuario(datos: any): Observable<any> {
    return this.http.post(this.apiUrlUsuarios, datos);
  }
}
