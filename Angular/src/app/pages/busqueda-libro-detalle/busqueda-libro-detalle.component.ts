import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // ✅ Importamos AuthService

@Component({
  selector: 'app-busqueda-libro-detalle',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './busqueda-libro-detalle.component.html',
  styleUrls: ['./busqueda-libro-detalle.component.css']
})
export class BusquedaLibroDetalleComponent implements OnInit {
  libro: any = null;
  libroSeleccionado: any = null; // ✅ añadida
  mostrarModal = false;
  estadoSeleccionado = 'lectura';
  puntuacion: number = 1;

  estaLogueado = false; // ✅ Nueva variable

  private apiKey = 'AIzaSyACE882Krrh-9OQQFSddSDjzvbDyQZYZOg';
  private apiUrl = 'http://localhost:8080/api/libros-usuarios';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService // ✅ Inyectamos AuthService
  ) {}

  ngOnInit() {
    this.estaLogueado = this.authService.estaLogueado(); // ✅ Verificamos login
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.obtenerLibro(id);
  }

  obtenerLibro(id: string) {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${this.apiKey}&langRestrict=es`;
    this.http.get<any>(url).subscribe(data => {
      const info = data.volumeInfo;
      this.libro = {
        id,
        titulo: info.title,
        autor: info.authors?.join(', ') || 'Autor desconocido',
        descripcion: info.description || 'Sin descripción disponible',
        imagen: info.imageLinks?.thumbnail || '/assets/images/imagenNoDisponible.png'
      };
    });
  }

  abrirModal() {
  if (!this.authService.estaLogueado()) {
    alert('Debes iniciar sesión para añadir libros.');
    return;
  }

  this.mostrarModal = true;
}


  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarLibro() {
    const usuarioId = this.authService.getUsuarioId();
    if (!usuarioId) {
      alert('Debes iniciar sesión para añadir libros.');
      return;
    }

    const datos = {
      usuarioId,
      libroId: this.libro.id,
      estado: this.estadoSeleccionado,
      puntuacion: this.puntuacion
    };

    this.http.post(this.apiUrl, datos).subscribe({
      next: () => {
        alert('Libro guardado correctamente');
        this.cerrarModal();
      },
      error: err => {
        console.error(err);
        alert('Error al guardar el libro');
      }
    });
  }

  reemplazarImagen(event: Event) {
    const elemento = event.target as HTMLImageElement;
    elemento.src = '/assets/images/imagenNoDisponible.png';
  }
}
