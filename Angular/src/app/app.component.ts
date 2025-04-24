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
    if (this.registroPassword !== this.registroConfirmacion) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const nuevoUsuario: Usuario = {
      nombre: this.registroNombre,
      email: this.registroEmail,
      contrasena: this.registroPassword
    };

    this.usuarioService.registrar(nuevoUsuario).subscribe({
      next: res => {
        console.log('Usuario registrado:', res);
        alert('Usuario registrado con éxito');
        this.showRegisterForm = false;
        this.showLoginForm = false;
      },
      error: err => {
        console.error('Error al registrar:', err);
        alert('Error al registrar usuario.');
      }
    });
  }
}
