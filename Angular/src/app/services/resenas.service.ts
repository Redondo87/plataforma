import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

export interface Resena {
  id?: number;
  usuarioId: number;
  tipo: 'libro' | 'serie' | 'pelicula';
  itemId: string;
  contenido: string;
  fechaCreacion?: string;
  nombreUsuario?: string;
  imagenUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ResenasService {


  private API_URL = `${environment.apiBase}/api/resenas`;

  constructor(private http: HttpClient) {}

  // Obtener reseñas por tipo
  obtenerResenas(tipo: string, itemId: string): Observable<Resena[]> {
    return this.http.get<Resena[]>(
      `${this.API_URL}?tipo=${tipo}&itemId=${itemId}`
    );
  }

  // Obtener reseñas recientes
  obtenerRecientes(tipo?: 'libro' | 'serie' | 'pelicula'): Observable<Resena[]> {
    const url = tipo
      ? `${this.API_URL}/recientes?tipo=${tipo}`
      : `${this.API_URL}/recientes`;

    return this.http.get<Resena[]>(url);
  }

  // Crear reseña
  crearResena(resena: Resena): Observable<Resena> {
    return this.http.post<Resena>(this.API_URL, resena);
  }
}
