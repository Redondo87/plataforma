import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  private API_URL = 'https://api.themoviedb.org/3';
  private API_KEY = '218315c8512d576a1f186b27b8d7538e'; 

  constructor(private http: HttpClient) {}

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
        return {
          ...detalle,
          streamingProviders
        };
      })
    );
  }
}
