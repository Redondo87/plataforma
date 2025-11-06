import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-busqueda-series-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './busqueda-series-peliculas.component.html',
  styleUrls: ['./busqueda-series-peliculas.component.css']
})
export class BusquedaSeriesPeliculasComponent implements OnInit {
  terminoBusqueda: string = '';
  generoSeleccionado: string = '';
  resultados: any[] = [];
  resultadosFiltrados: any[] = [];
  itemSeleccionado: any = null;
  generos: string[] = [
    'Acción', 
    'Aventura', 
    'Comedia', 
    'Drama', 
    'Fantasía',
    'Ciencia Ficción', 
    'Terror', 
    'Romance', 
    'Animación', 
    'Documental',
    'Misterio',
    'thriller',
    'Crimen',
    'Bélico',
    'Historia',
    'Musical',
    'Western',
    'Familia',
    'Suspense',
    'Guerra',
    'Cultura Pop',
    'Superhéroes',
    'Deportes',
    'Viajes en el tiempo',
    'Zombis',
    'Vampiros',
    'Magia',
    'Mitología'
    
  ];

  private apiKey: string = 'TU_API_KEY_DE_TMDB';
  private baseUrl: string = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Al inicio podríamos mostrar contenido popular o vacío
    this.cargarContenidoInicial();
  }

  /** 🔎 Buscar series o películas según el término escrito */
  filtrarResultados(): void {
    if (!this.terminoBusqueda.trim()) {
      this.resultadosFiltrados = [];
      return;
    }

    const url = `${this.baseUrl}/search/multi?api_key=${this.apiKey}&language=es-ES&query=${this.terminoBusqueda}`;

    this.http.get<any>(url).subscribe(data => {
      this.resultados = data.results.map((item: any) => ({
        id: item.id,
        titulo: item.title || item.name,
        descripcion: item.overview,
        portada: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : 'https://via.placeholder.com/300x450?text=Sin+Imagen',
        creadores: item.media_type === 'tv'
          ? 'Serie de TV'
          : 'Película'
      }));
      this.resultadosFiltrados = this.resultados;
    });
  }

  /** 🎭 Filtrar los resultados por género (solo visual, no API) */
  filtrarPorGenero(genero: string): void {
    this.generoSeleccionado = genero;
    // Si no hay resultados todavía, no hacemos nada
    if (this.resultados.length === 0) return;

    this.resultadosFiltrados = this.resultados.filter(item =>
      item.descripcion.toLowerCase().includes(genero.toLowerCase()) ||
      item.titulo.toLowerCase().includes(genero.toLowerCase())
    );
  }

  /** Cargar algo inicial si se desea */
  private cargarContenidoInicial(): void {
    const url = `${this.baseUrl}/trending/all/day?api_key=${this.apiKey}&language=es-ES`;
    this.http.get<any>(url).subscribe(data => {
      this.resultados = data.results.map((item: any) => ({
        id: item.id,
        titulo: item.title || item.name,
        descripcion: item.overview,
        portada: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : 'https://via.placeholder.com/300x450?text=Sin+Imagen',
        creadores: item.media_type === 'tv'
          ? 'Serie de TV'
          : 'Película'
      }));
      this.resultadosFiltrados = this.resultados;
    });
  }

  /** Mostrar modal con detalle */
  abrirModal(item: any): void {
    this.itemSeleccionado = item;
  }

  /** Cerrar modal */
  cerrarModal(): void {
    this.itemSeleccionado = null;
  }
}
