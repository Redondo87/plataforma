import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UsuarioService, Usuario } from './services/usuario.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  usuarioLogueado = false;
  nombreUsuario = '';

  showLoginForm = false;
  showRegisterForm = false;

  loginEmail = '';
  loginPassword = '';

  registroNombre = '';
  registroEmail = '';
  registroPassword = '';
  registroConfirmacion = '';

  constructor(private usuarioService: UsuarioService, private authService: AuthService) {}

  // Abrir/cerrar panel de login
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

  // Cerrar sesión (recibido desde Header)
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.usuarioLogueado = false;
    this.nombreUsuario = '';
  }

  // Registrar
  registrarUsuario() {
    const password = this.registroPassword;

    const passwordValida =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

    if (!passwordValida) {
      alert('La contraseña debe cumplir los requisitos.');
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
        alert('Usuario registrado');
        this.showLoginForm = false;
        this.showRegisterForm = false;
        this.clearForm();
      },
      error: err => {
        alert('Error en el registro: ' + (err.error || ''));
      }
    });
  }

  // Login
  loginUsuario() {
    const credenciales = {
      email: this.loginEmail,
      contrasena: this.loginPassword
    };

    this.usuarioService.http.post('http://localhost:8080/api/usuarios/login', credenciales)
      .subscribe({
        next: (usuario: any) => {
          this.authService.setUsuario(usuario.id, usuario.nombre);

          this.usuarioLogueado = true;
          this.nombreUsuario = usuario.nombre;

          this.showLoginForm = false;
          this.clearForm();
        },
        error: () => {
          alert('Credenciales incorrectas.');
        }
      });
  }

  private clearForm() {
    this.loginEmail = '';
    this.loginPassword = '';
    this.registroNombre = '';
    this.registroEmail = '';
    this.registroPassword = '';
    this.registroConfirmacion = '';
  }
}
