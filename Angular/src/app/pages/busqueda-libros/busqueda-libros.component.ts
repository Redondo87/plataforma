import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import * as he from 'he';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-busqueda-libros',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './busqueda-libros.component.html',
  styleUrls: ['./busqueda-libros.component.css']
})
export class BusquedaLibrosComponent {
  busqueda: string = '';
  resultados: any[] = [];
  private searchTimeout: any;
  modoGenero: boolean = false;
  mensaje: string = '';

  generos: string[] = [
    'Fantasía', 'Ciencia ficción', 'Romance', 'Misterio', 'Terror',
    'Histórico', 'Biografía', 'Infantil', 'Aventura', 'No ficción',
    'Poesía', 'Clásicos', 'Thriller', 'Autoayuda',
    'Desarrollo personal', 'Filosofía', 'Religión', 'Ensayo',
    'Cómics', 'Novela gráfica', 'Ciencia', 'Tecnología', 'Salud',
    'Viajes', 'Cocina', 'Arte', 'Música', 'Deportes'
  ];

  // ✅ solo backend
  private apiBase = 'http://localhost:8080/api/external';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Buscar por texto
  buscarLibros() {
    this.modoGenero = false;
    this.mensaje = '';
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      const consulta = this.busqueda.trim();
      if (consulta.length < 3) {
        this.resultados = [];
        return;
      }

      const url = `${this.apiBase}/books/search?q=${encodeURIComponent(consulta)}`;

      this.http.get<any>(url).subscribe({
        next: response => {
          this.resultados = (response.items || [])
            .filter((item: any) => item.volumeInfo?.description)
            .map((item: any) => {
              const info = item.volumeInfo;
              return {
                id: item.id,
                titulo: info.title,
                autor: info.authors?.join(', ') || 'Autor desconocido',
                descripcion: this.limpiarTexto(info.description),
                imagen: info.imageLinks?.thumbnail || '/assets/images/imagenNoDisponible.png',
                idioma: info.language
              };
            });
        },
        error: err => {
          console.error('Error buscando libros:', err);
          this.resultados = [];
          this.mensaje = 'Error al buscar libros. Intenta más tarde.';
        }
      });
    }, 400);
  }

  // Buscar por género
  buscarPorGenero(genero: string) {
    this.modoGenero = true;
    this.busqueda = '';
    this.mensaje = '';

    // ✅ usamos el mismo endpoint, cambiando la query
    const q = `subject:${genero}`;
    const url = `${this.apiBase}/books/search?q=${encodeURIComponent(q)}`;

    this.http.get<any>(url).subscribe({
      next: response => {
        if (!response.items || response.items.length === 0) {
          this.resultados = [];
          this.mensaje = `No se encontraron libros en el género "${genero}".`;
          return;
        }

        const librosFiltrados = response.items.filter((item: any) => {
          return item.volumeInfo?.description && item.volumeInfo.description.length > 0;
        });

        if (librosFiltrados.length === 0) {
          this.resultados = [];
          this.mensaje = `No se encontraron libros con descripción en el género "${genero}".`;
          return;
        }

        this.resultados = librosFiltrados.map((item: any) => {
          const info = item.volumeInfo;
          return {
            id: item.id,
            titulo: info.title,
            autor: info.authors?.join(', ') || 'Autor desconocido',
            descripcion: this.limpiarTexto(info.description),
            imagen: info.imageLinks?.thumbnail || '/assets/images/imagenNoDisponible.png',
            idioma: info.language
          };
        });
      },
      error: err => {
        console.error('Error cargando libros por género:', err);
        this.resultados = [];
        this.mensaje = `No se pudieron cargar los libros del género "${genero}". Intenta más tarde.`;
      }
    });
  }

  limpiarTexto(texto: string): string {
    if (!texto) return texto;
    return he.decode(texto).replace(/�/g, ' ').trim();
  }

  reemplazarImagen(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/images/imagenNoDisponible.png';
  }

  guardarLibro(item: any, estado: string, puntuacion: number) {
    const usuarioId = this.authService.getUsuarioId();
    if (!usuarioId) {
      alert('Debes iniciar sesión para guardar libros.');
      return;
    }

    const body = {
      usuarioId,
      libroId: item.id,
      estado,
      puntuacion
    };

    this.http.post('http://localhost:8080/api/libros-usuarios', body).subscribe({
      next: () => alert('Libro guardado correctamente'),
      error: err => {
        console.error('Error guardando libro:', err);
        alert('Error al guardar el libro.');
      }
    });
  }
}
