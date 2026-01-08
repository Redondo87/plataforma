import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resena {
  id?: number;
  usuarioId: number;
  tipo: 'libro' | 'serie' | 'pelicula';
  itemId: string;
  contenido: string;
  fechaCreacion?: string;
  nombreUsuario?: string;
}

@Injectable({ providedIn: 'root' })
export class ResenasService {

  private API_URL = 'http://localhost:8080/api/resenas';

  constructor(private http: HttpClient) {}

  // Obtener reseñas 
  obtenerResenas(tipo: string, itemId: string): Observable<Resena[]> {
    return this.http.get<Resena[]>(
      `${this.API_URL}?tipo=${tipo}&itemId=${itemId}`
    );
  }

  // Crear una nueva reseña
  crearResena(resena: Resena): Observable<Resena> {
    return this.http.post<Resena>(this.API_URL, resena);
  }
}
