import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LibrosService {

  private API_URL = 'http://localhost:8080/api/libros-usuarios';
  private GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  // ⭐ TOP libros (backend propio)
  obtenerTopLibros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/top`);
  }

  // 📖 DETALLE de libro (Google Books, usado en libro-detalle)
  obtenerLibroPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.GOOGLE_BOOKS_URL}/${id}`);
  }
}
