import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LibrosService {
  private API_URL = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  buscarLibros(termino: string): Observable<any> {
    return this.http.get(`${this.API_URL}?q=${termino}`);
  }

  obtenerLibroPorId(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}
