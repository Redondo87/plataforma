import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { ResenasService, Resena } from '../../services/resenas.service';

@Component({
  selector: 'app-busqueda-libro-detalle',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './busqueda-libro-detalle.component.html',
  styleUrls: ['./busqueda-libro-detalle.component.css']
})
export class BusquedaLibroDetalleComponent implements OnInit {

  libro: any = null;

  mostrarModal = false;
  estadoSeleccionado = 'lectura';
  puntuacion: number = 1;

  resenas: Resena[] = [];
  nuevaResena = '';
  cargandoResenas = false;

  yaExiste = false;
  registroUsuario: any = null;

  private apiUrl = 'http://localhost:8080/api/libros-usuarios';
  private apiBase = 'http://localhost:8080/api/external';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService,
    private resenasService: ResenasService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.obtenerLibro(id);
  }

  obtenerLibro(id: string) {
    const url = `${this.apiBase}/books/volumes/${id}`;

    this.http.get<any>(url).subscribe(data => {
      const info = data.volumeInfo;
      this.libro = {
        id,
        titulo: info.title,
        autor: info.authors?.join(', ') || 'Autor desconocido',
        descripcion: info.description || 'Sin descripción disponible',
        imagen: info.imageLinks?.thumbnail || '/assets/images/imagenNoDisponible.png'
      };

      this.comprobarSiYaExiste();
    });
  }

  comprobarSiYaExiste() {

    if (!this.authService.estaLogueado()) return;

    const usuarioId = this.authService.getUsuarioId();
    if (!usuarioId || !this.libro?.id) return;

    this.http.get<any>(
      `${this.apiUrl}/usuario/${usuarioId}/libro/${this.libro.id}`
    ).subscribe(data => {

      if (data) {
        this.yaExiste = true;
        this.registroUsuario = data;

        this.estadoSeleccionado = data.estado;
        this.puntuacion = data.puntuacion ?? 1;
      }
    });
  }

  reemplazarImagen(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/imagenNoDisponible.png';
  }

  abrirModal() {
    if (!this.authService.estaLogueado()) {
      alert('Debes iniciar sesión para añadir libros.');
      return;
    }

    this.mostrarModal = true;

    if (this.libro?.id) {
      this.cargarResenas(this.libro.id);
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevaResena = '';
  }

  guardarLibro() {

    const usuarioId = this.authService.getUsuarioId();
    if (!usuarioId || !this.libro?.id) return;

    const datos = {
      usuarioId,
      libroId: this.libro.id,
      estado: this.estadoSeleccionado,
      puntuacion: this.puntuacion
    };

    this.http.post(this.apiUrl, datos).subscribe({
      next: () => {
        alert(this.yaExiste ? 'Actualizado correctamente' : 'Guardado correctamente');
        this.comprobarSiYaExiste();
        this.cerrarModal();
      },
      error: err => {
        console.error(err);
        alert('Error al guardar el libro');
      }
    });
  }

  cargarResenas(libroId: string) {
    this.cargandoResenas = true;

    this.resenasService.obtenerResenas('libro', libroId).subscribe({
      next: data => {
        this.resenas = data;
        this.cargandoResenas = false;
      },
      error: () => {
        this.resenas = [];
        this.cargandoResenas = false;
      }
    });
  }

  guardarResena() {
    const usuarioId = this.authService.getUsuarioId();
    if (!usuarioId || !this.libro?.id) return;

    const contenido = this.nuevaResena.trim();
    if (!contenido) return;

    const resena: Resena = {
      usuarioId,
      tipo: 'libro',
      itemId: this.libro.id,
      contenido,
      imagenUrl: this.libro.imagen || '/assets/images/imagenNoDisponible.png'
    };

    this.resenasService.crearResena(resena).subscribe(() => {
      this.nuevaResena = '';
      this.cargarResenas(this.libro.id);
    });
  }
}