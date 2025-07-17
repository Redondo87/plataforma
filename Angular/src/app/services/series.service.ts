import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  private API_URL = 'https://api.themoviedb.org/3';
  private API_KEY = 'T218315c8512d576a1f186b27b8d7538e'; 

  constructor(private http: HttpClient) {}

  buscarSeries(termino: string): Observable<any> {
    return this.http.get(`${this.API_URL}/search/multi`, {
      params: {
        api_key: this.API_KEY,
        query: termino
      }
    });
  }

  obtenerDetalle(tipo: string, id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${tipo}/${id}`, {
      params: {
        api_key: this.API_KEY
      }
    });
  }
}
