import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioIdKey = 'usuarioId';
  private usuarioNombreKey = 'usuarioNombre';

  constructor() {}

  // Devuelve el Id del usuario logueado
  getUsuarioId(): number | null {
    const userId = localStorage.getItem(this.usuarioIdKey);
    if (!userId || userId === 'undefined' || userId === 'null') return null;
    return +userId;
  }

  // Devuelve el nombre del usuario logueado
  getUsuarioNombre(): string | null {
    const nombre = localStorage.getItem(this.usuarioNombreKey);
    if (!nombre || nombre === 'undefined' || nombre === 'null') return null;
    return nombre;
  }

  // Devuelve usuario completo
  getUsuario() {
    const id = this.getUsuarioId();
    const nombre = this.getUsuarioNombre();

    if (!id) return null;
    return { id, nombre };
  }

  // Verifica si el usuario está logueado
  estaLogueado(): boolean {
    return this.getUsuarioId() !== null;
  }

  // Cierra la sesión correctamente
  cerrarSesion(): void {
    localStorage.removeItem(this.usuarioIdKey);
    localStorage.removeItem(this.usuarioNombreKey);
  }

  // Opcional: método para login
  login(id: number, nombre: string): void {
    localStorage.setItem(this.usuarioIdKey, id.toString());
    localStorage.setItem(this.usuarioNombreKey, nombre);
  }
}
