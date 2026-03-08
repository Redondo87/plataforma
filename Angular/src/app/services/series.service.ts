import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SeriesService {

  private apiBase = environment.apiBase;
  private externalTmdb = `${this.apiBase}/api/external/tmdb`;
  private apiUrlUsuarios = `${this.apiBase}/api/series-usuarios`;

  constructor(private http: HttpClient) {}

  /**Obtener detalle de una serie/película */
  obtenerDetalle(tipo: 'tv' | 'movie', id: string): Observable<any> {
    const detalle$ = this.http.get<any>(`${this.externalTmdb}/detail`, {
      params: { tipo, id, language: 'es-ES' }
    });

    const proveedores$ = this.http.get<any>(`${this.externalTmdb}/watch-providers`, {
      params: { tipo, id }
    });

    return forkJoin({ detalle: detalle$, proveedores: proveedores$ }).pipe(
      map(({ detalle, proveedores }) => {
        const region = proveedores?.results?.['ES'];
        const streamingProviders = region?.flatrate || [];
        return { ...detalle, streamingProviders };
      })
    );
  }

  /**TOP series*/
  obtenerMejoresSeries(): Observable<any[]> {
    return this.http.get<any>(`${this.externalTmdb}/top-rated-tv`, {
      params: { language: 'es-ES' }
    }).pipe(
      map((resp: any) =>
        (resp?.results ?? []).map((s: any, index: number) => ({
          id: s.id,
          titulo: s.name,
          imagen: s.poster_path
            ? `https://image.tmdb.org/t/p/w200${s.poster_path}`
            : '/assets/images/imagenNoDisponible.png',
          promedio: s.vote_average,
          ranking: index + 1
        }))
      )
    );
  }

  // Series/películas guardadas por el usuario 
  obtenerSeriesUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlUsuarios}/usuario/${usuarioId}`);
  }

  //  Guardar serie/película 
  guardarSerieUsuario(datos: any): Observable<any> {
    return this.http.post(this.apiUrlUsuarios, datos);
  }
}