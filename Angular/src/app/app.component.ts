interface LibroGoogle {
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string };
  };
  saleInfo?: {
    listPrice?: {
      amount: number;
    };
  };
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from './services/usuario.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showLoginForm = false;
  showRegisterForm = false;

  registroNombre = '';
  registroEmail = '';
  registroPassword = '';
  registroConfirmacion = '';

  usuarioLogueado = false;
  nombreUsuario = '';

  mostrarLibros = false;
  mostrarSeries = false;

  busquedaLibros = '';
  resultadosLibros: any[] = [];

  busquedaSeries = '';
  resultadosSeries: any[] = [];

  

  constructor(private usuarioService: UsuarioService) {}

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

  registrarUsuario() {
    const password = this.registroPassword;
    const passwordValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    if (!passwordValida) {
      alert('La contraseña debe tener al menos:\n- 8 caracteres\n- Una letra mayúscula\n- Una letra minúscula\n- Un número\n- Un carácter especial');
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

  loginUsuario() {
    this.usuarioLogueado = true;
    this.nombreUsuario = this.registroNombre;
    this.showLoginForm = false;
    this.clearForm();
  }

  cerrarSesion() {
    this.usuarioLogueado = false;
    this.nombreUsuario = '';
  }

  private clearForm() {
    this.registroNombre = '';
    this.registroEmail = '';
    this.registroPassword = '';
    this.registroConfirmacion = '';
  }

  toggleLibros() {
    this.mostrarLibros = !this.mostrarLibros;
    this.mostrarSeries = false;
  }

  toggleSeries() {
    this.mostrarSeries = !this.mostrarSeries;
    this.mostrarLibros = false;
  }

  buscarLibros() {
    if (!this.busquedaLibros.trim()) {
      this.resultadosLibros = [];
      return;
    }

    const apiKey = 'AIzaSyACE882Krrh-9OQQFSddSDjzvbDyQZYZOg';
    const query = encodeURIComponent(this.busquedaLibros);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

    this.usuarioService.http.get<any>(url).subscribe(response => {
      this.resultadosLibros = (response.items || []).map((item: LibroGoogle) => {
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

  buscarSeries() {
    if (!this.busquedaSeries.trim()) {
      this.resultadosSeries = [];
      return;
    }

    const apiKey = '218315c8512d576a1f186b27b8d7538e';
    const query = encodeURIComponent(this.busquedaSeries);
    const url = `https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${apiKey}&language=es`;

    this.usuarioService.http.get<any>(url).subscribe(res => {
      this.resultadosSeries = res.results || [];
    });
  }

}
