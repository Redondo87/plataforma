import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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

  generos: string[] = [
    'Fantasía', 'Ciencia ficción', 'Romance', 'Misterio', 'Terror',
    'Histórico', 'Biografía', 'Infantil', 'Aventura', 'No ficción',
    'Poesía', 'Clásicos', 'Thriller', 'Autoayuda',
    'Desarrollo personal', 'Filosofía', 'Religión', 'Ensayo',
    'Cómics', 'Novela gráfica', 'Ciencia', 'Tecnología', 'Salud',
    'Viajes', 'Cocina', 'Arte', 'Música', 'Deportes'
  ];

  private apiKey = 'AIzaSyACE882Krrh-9OQQFSddSDjzvbDyQZYZOg';

  constructor(private http: HttpClient) {}

  buscarLibros() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      const consulta = this.busqueda.trim();

      if (consulta.length < 3) {
        this.resultados = [];
        return;
      }

      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        consulta
      )}&key=${this.apiKey}&langRestrict=es`;

      this.http.get<any>(url).subscribe(response => {
        this.resultados = (response.items || []).map((item: any) => {
          const info = item.volumeInfo;
          return {
            id: item.id,
            titulo: info.title,
            autor: info.authors?.join(', ') || 'Autor desconocido',
            descripcion: info.description || 'Sin descripción disponible',
            imagen: info.imageLinks?.thumbnail || 'assets/imagen-no-disponible.jpg'
          };
        });
      });
    }, 400); // espera 400ms después de dejar de escribir
  }

  buscarPorGenero(genero: string) {
    this.busqueda = genero;
    this.buscarLibros();
  }
}
