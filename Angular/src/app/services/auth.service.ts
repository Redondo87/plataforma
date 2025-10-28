import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // ✅ Devuelve el Id del usuario logueado
  getUsuarioId(): number | null {
    const userId = localStorage.getItem('usuarioId'); // 🔁 cambiamos clave
    return userId ? +userId : null;
  }

  // ✅ Devuelve el nombre del usuario logueado
  getUsuarioNombre(): string | null {
    return localStorage.getItem('usuarioNombre'); // 🔁 cambiamos clave
  }

  // ✅ Verifica si el usuario está logueado
  estaLogueado(): boolean {
    return !!localStorage.getItem('usuarioId'); // 🔁 cambiamos clave
  }

  // ✅ Cierra la sesión
  cerrarSesion(): void {
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
  }
}
