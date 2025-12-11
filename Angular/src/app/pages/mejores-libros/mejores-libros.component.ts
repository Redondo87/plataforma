import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mejores-libros',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './mejores-libros.component.html',
  styleUrls: ['./mejores-libros.component.css']
})
export class MejoresLibrosComponent implements OnInit {

  mejoresLibros: any[] = [];
  cargando = true;
  error = '';

  mostrarModal = false;
  libroSeleccionado: any = null;
  estadoSeleccionado: string = 'lectura';
  puntuacion: number | null = null;

  constructor(private http: HttpClient, public authService: AuthService) { }

  ngOnInit() {
    this.cargarMejoresLibros();
  }

  // 🔐 Igual que en "mejores series"
  get estaLogueado() {
    return this.authService.estaLogueado();
  }

    cargarMejoresLibros() {
    const usuarioId = this.authService.getUsuarioId();

    const url = usuarioId
      ? `http://localhost:8080/api/libros-usuarios/top?usuarioId=${usuarioId}`
      : `http://localhost:8080/api/libros-usuarios/top`;

    this.http.get<any[]>(url)
      .subscribe({
        next: data => {
          this.mejoresLibros = data;
          this.cargando = false;
        },
        error: err => {
          console.error(err);
          this.error = 'Error al cargar los mejores libros';
          this.cargando = false;
        }
      });
  }

  abrirModal(libro: any) {
    if (!this.estaLogueado) return;

    this.libroSeleccionado = libro;
    this.estadoSeleccionado = 'lectura';
    this.puntuacion = libro.miPuntuacion || null;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.libroSeleccionado = null;
    this.puntuacion = null;
  }

  guardarLibro() {
    if (!this.libroSeleccionado) return;

    const usuarioId = this.authService.getUsuarioId();
    if (!usuarioId) return;

    const nuevoLibro = {
      usuarioId,
      libroId: this.libroSeleccionado.libroId,
      estado: this.estadoSeleccionado,
      puntuacion: this.puntuacion
    };

    this.http.post('http://localhost:8080/api/libros-usuarios', nuevoLibro)
      .subscribe({
        next: () => {
          alert('Libro añadido a tu lista');
          this.cerrarModal();
          this.cargarMejoresLibros();
        },
        error: err => {
          console.error(err);
          alert('Error al añadir libro');
        }
      });
  }
}
