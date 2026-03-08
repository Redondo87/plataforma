import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class LibrosService {

  private API_URL = `${environment.apiBase}/api/libros-usuarios`;

  private GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  // TOP libros 
  obtenerTopLibros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/top`);
  }

  // DETALLE libro desde Google Books
  obtenerLibroPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.GOOGLE_BOOKS_URL}/${id}`);
  }
}