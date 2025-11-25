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

  // Campos login
  loginEmail = '';
  loginPassword = '';

  // Formularios login / registro
  showLoginForm = false;
  showRegisterForm = false;

  // Campos registro
  registroNombre = '';
  registroEmail = '';
  registroPassword = '';
  registroConfirmacion = '';

  constructor(private usuarioService: UsuarioService) {}

  // Mostrar / ocultar login
  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    this.showRegisterForm = false;
  }

  // Cambiar a formulario registro
  showRegister() {
    this.showRegisterForm = true;
  }

  // Cambiar a formulario login
  showLogin() {
    this.showRegisterForm = false;
  }

  // Cerrar sesión
  cerrarSesion() {
    this.usuarioLogueado = false;
    this.nombreUsuario = '';
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
  }

  // Registrar usuario
  registrarUsuario() {
    const password = this.registroPassword;
    const passwordValida =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

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
      next: (res) => {
        alert('Usuario registrado con éxito');
        this.showRegisterForm = false;
        this.showLoginForm = false;
        this.clearForm();
      },
      error: (err) => {
        console.error('Error registro:', err);
        if (err.error) {
          alert('Error al registrar usuario: ' + err.error);
        } else {
          alert('Error al registrar usuario. Revisa la consola.');
        }
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
          localStorage.setItem('usuarioId', usuario.id.toString());
          localStorage.setItem('usuarioNombre', usuario.nombre);

          this.usuarioLogueado = true;
          this.nombreUsuario = usuario.nombre;
          this.showLoginForm = false;

          this.clearForm();
        },
        error: err => {
          console.error('Error login:', err);
          if (err.error) {
            alert('Error al iniciar sesión: ' + err.error);
          } else {
            alert('Credenciales incorrectas o usuario no encontrado.');
          }
        }
      });
  }

  // Limpiar campos login y registro
  private clearForm() {
    this.registroNombre = '';
    this.registroEmail = '';
    this.registroPassword = '';
    this.registroConfirmacion = '';

    this.loginEmail = '';
    this.loginPassword = '';
  }
}
