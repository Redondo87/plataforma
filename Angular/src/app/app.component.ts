import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UsuarioService, Usuario } from './services/usuario.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Estado de usuario
  usuarioLogueado = false;
  nombreUsuario = '';

  // Desplegables
  mostrarLibros = false;
  busquedaLibros = '';
  resultadosLibros: any[] = [];

  mostrarSeries = false;
  busquedaSeries = '';
  resultadosSeries: any[] = [];

  // Formularios login/registro
  showLoginForm = false;
  showRegisterForm = false;
  registroNombre = '';
  registroEmail = '';
  registroPassword = '';
  registroConfirmacion = '';

  constructor(private usuarioService: UsuarioService) {}

  // Funciones de interfaz
  toggleLibros() {
    this.mostrarLibros = !this.mostrarLibros;
    this.mostrarSeries = false;
  }

  toggleSeries() {
    this.mostrarSeries = !this.mostrarSeries;
    this.mostrarLibros = false;
  }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    this.showRegisterForm = false;
  }

  showRegister() {
    this.showRegisterForm = true;
  }

  showLogin() {
    this.showRegisterForm = false;
  }

  cerrarSesion() {
  this.usuarioLogueado = false;
  this.nombreUsuario = '';
  localStorage.removeItem('usuarioId');
  localStorage.removeItem('usuarioNombre');
}
  // Búsqueda de libros (mínimo 3 caracteres)
  buscarLibros() {
    const consulta = this.busquedaLibros.trim();
    if (consulta.length < 3) {
      this.resultadosLibros = [];
      return;
    }

    const apiKey = 'AIzaSyACE882Krrh-9OQQFSddSDjzvbDyQZYZOg';
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(consulta)}&key=${apiKey}`;

    this.usuarioService.http.get<any>(url).subscribe(response => {
      this.resultadosLibros = (response.items || []).map((item: any) => {
        const info = item.volumeInfo;
        const sale = item.saleInfo;

        return {
          titulo: info.title,
          autor: info.authors?.[0] || 'Autor desconocido',
          descripcion: info.description || 'Sin descripción disponible.',
          precio: sale?.listPrice?.amount ?? null,
          imagen: info.imageLinks?.thumbnail || 'assets/imagen-no-disponible.jpg'
        };
      });
    });
  }

  // Búsqueda de series/películas (mínimo 3 caracteres)
  buscarSeries() {
    const consulta = this.busquedaSeries.trim();
    if (consulta.length < 3) {
      this.resultadosSeries = [];
      return;
    }

    const apiKey = '218315c8512d576a1f186b27b8d7538e';
    const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(consulta)}&api_key=${apiKey}&language=es-ES`;

    this.usuarioService.http.get<any>(url).subscribe(response => {
      this.resultadosSeries = response.results || [];
    });
  }

  // Devuelve URL de imagen para TMDB
  getImageUrl(path: string): string {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : 'assets/no-image.jpg';
  }

  // Registro de usuario
  registrarUsuario() {
    const password = this.registroPassword;
    const passwordValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

    if (!passwordValida) {
      alert('La contraseña debe tener:\n- 8 caracteres\n- Una letra mayúscula\n- Una letra minúscula\n- Un número\n- Un carácter especial');
      return;
    }
    if (password !== this.registroConfirmacion) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const nuevoUsuario: Usuario = {
      nombre: this.registroNombre,
      email: this.registroEmail,
      contrasena: password
    };

    this.usuarioService.registrar(nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario registrado con éxito');
        this.showRegisterForm = false;
        this.showLoginForm = false;
        this.clearForm();
      },
      error: () => {
        alert('Error al registrar usuario.');
      }
    });
  }

// Login
loginUsuario() {
  const credenciales = {
    email: this.registroEmail,
    contrasena: this.registroPassword
  };

  this.usuarioService.http.post('http://localhost:8080/api/usuarios/login', credenciales)
    .subscribe({
      next: (usuario: any) => {
        localStorage.setItem('usuarioId', usuario.id.toString());
        localStorage.setItem('usuarioNombre', usuario.nombre);

        this.usuarioLogueado = true;
        this.nombreUsuario = usuario.nombre;
        this.showLoginForm = false;

        this.clearForm();
      },
      error: err => {
        console.error('Error en login:', err);
        alert('Credenciales incorrectas o usuario no encontrado.');
      }
    });
}


  // Limpiar campos
  private clearForm() {
    this.registroNombre = '';
    this.registroEmail = '';
    this.registroPassword = '';
    this.registroConfirmacion = '';
  }
}
