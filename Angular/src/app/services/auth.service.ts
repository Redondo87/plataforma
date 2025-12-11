import { Injectable } from '@angular/core';

export interface UsuarioSesion {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioActual: UsuarioSesion | null = null;

  constructor() {}

  // Guarda usuario al iniciar sesión
  setUsuario(id: number, nombre: string) {
    this.usuarioActual = { id, nombre };
  }

  // Recupera el usuario completo (compatible con código antiguo)
  getUsuario(): UsuarioSesion | null {
    return this.usuarioActual;
  }

  // Solo el ID
  getUsuarioId(): number | null {
    return this.usuarioActual?.id ?? null;
  }

  // Solo el nombre
  getUsuarioNombre(): string | null {
    return this.usuarioActual?.nombre ?? null;
  }

  // ¿Está logueado?
  estaLogueado(): boolean {
    return this.usuarioActual !== null;
  }

  // Cerrar sesión
  cerrarSesion(): void {
    this.usuarioActual = null;
  }
}
