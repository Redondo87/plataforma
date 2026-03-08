
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  contrasena: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  // ✅ YA NO QUEDA "localhost" EN EL CÓDIGO
  private apiUrl = `${environment.apiBase}/api/usuarios`;

  constructor(public http: HttpClient) {}

  registrar(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }

  login(credenciales: { email: string; contrasena: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credenciales);
  }
}
