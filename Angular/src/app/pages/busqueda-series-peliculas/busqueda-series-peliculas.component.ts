import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-busqueda-series-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './busqueda-series-peliculas.component.html',
  styleUrls: ['./busqueda-series-peliculas.component.css']
})
export class BusquedaSeriesPeliculasComponent implements OnInit {
  terminoBusqueda: string = '';
  generoSeleccionado: string = '';
  resultados: any[] = [];
  resultadosFiltrados: any[] = [];
  itemSeleccionado: any = null;
  mostrarGeneros: boolean = true; // 👈 Controla si se muestran los géneros o los resultados

  generos: string[] = [
    'Acción', 'Aventura', 'Comedia', 'Drama', 'Fantasía', 'Ciencia Ficción', 'Terror', 'Romance',
    'Animación', 'Documental', 'Misterio', 'Thriller', 'Crimen', 'Bélico', 'Historia', 'Musical',
    'Western', 'Familia', 'Suspense', 'Guerra', 'Cultura Pop', 'Superhéroes', 'Deportes',
    'Viajes en el tiempo', 'Zombis', 'Vampiros', 'Magia', 'Mitología'
  ];

  private generosIds: { [key: string]: number } = {};
  private apiKey: string = '218315c8512d576a1f186b27b8d7538e';
  private baseUrl: string = 'https://api.themoviedb.org/3';

  sugerencias: any[] = [];
  mostrarSugerencias = false;

  private debounceTimer: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarGenerosTMDB();
    this.resultados = [];
    this.resultadosFiltrados = [];
    this.sugerencias = [];
    this.itemSeleccionado = null;
  }

  onInput(): void {
    if (this.terminoBusqueda.trim().length < 3) {
      this.sugerencias = [];
      this.mostrarSugerencias = false;

      if (this.terminoBusqueda.trim().length === 0) {
        this.resultadosFiltrados = [...this.resultados];
      }
      return;
    }

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.buscarSugerencias(this.terminoBusqueda.trim());
    }, 300);
  }

  private buscarSugerencias(query: string): void {
    const url = `${this.baseUrl}/search/multi?api_key=${this.apiKey}&language=es-ES&query=${encodeURIComponent(query)}&page=1&include_adult=false`;

    this.http.get<any>(url).subscribe({
      next: data => {
        const items = (data.results || []).slice(0, 10);
        this.sugerencias = items.map((item: any) => ({
          id: item.id,
          media_type: item.media_type,
          titulo: item.title || item.name || 'Sin título',
          descripcion: item.overview || '',
          portada: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'assets/no-image.jpg',
          creadores: item.media_type === 'tv' ? 'Serie' : 'Película'
        }));
        this.mostrarSugerencias = this.sugerencias.length > 0;
      },
      error: err => {
        console.error('Error TMDB sugerencias', err);
        this.sugerencias = [];
        this.mostrarSugerencias = false;
      }
    });
  }

  irADetalle(item: any): void {
    if (!item || !item.id) return;
    this.mostrarSugerencias = false;
    this.router.navigate(['/series/detalle', item.media_type || 'movie', item.id]);
  }

  filtrarPorGenero(genero: string): void {
    this.generoSeleccionado = genero;
    this.mostrarGeneros = false; // 👈 Oculta los géneros al hacer clic

    const generoId = this.generosIds[genero];
    if (!generoId) {
      console.warn('Género no encontrado en TMDB:', genero);
      return;
    }

    const urlMovies = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${generoId}&language=es-ES`;
    const urlTV = `${this.baseUrl}/discover/tv?api_key=${this.apiKey}&with_genres=${generoId}&language=es-ES`;

    this.http.get<any>(urlMovies).subscribe({
      next: dataMovies => {
        const peliculas = (dataMovies.results || []).map((item: any) => ({
          id: item.id,
          media_type: 'movie',
          titulo: item.title || 'Sin título',
          descripcion: item.overview || '',
          portada: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'assets/no-image.jpg',
          creadores: 'Película'
        }));

        this.http.get<any>(urlTV).subscribe({
          next: dataTV => {
            const series = (dataTV.results || []).map((item: any) => ({
              id: item.id,
              media_type: 'tv',
              titulo: item.name || 'Sin título',
              descripcion: item.overview || '',
              portada: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'assets/no-image.jpg',
              creadores: 'Serie'
            }));

            this.resultadosFiltrados = [...peliculas, ...series];
          },
          error: err => console.error('Error al cargar series por género', err)
        });
      },
      error: err => console.error('Error al cargar películas por género', err)
    });
  }

  private cargarContenidoInicial(callback?: () => void): void {
    const url = `${this.baseUrl}/trending/all/day?api_key=${this.apiKey}&language=es-ES`;
    this.http.get<any>(url).subscribe({
      next: data => {
        this.resultados = (data.results || []).map((item: any) => ({
          id: item.id,
          media_type: item.media_type,
          titulo: item.title || item.name || 'Sin título',
          descripcion: item.overview || '',
          portada: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'assets/no-image.jpg',
          creadores: item.media_type === 'tv' ? 'Serie' : 'Película'
        }));
        this.resultadosFiltrados = [...this.resultados];
        if (callback) callback();
      },
      error: err => {
        console.error('Error cargando trending', err);
        if (callback) callback();
      }
    });
  }

  abrirModal(item: any): void {
    this.itemSeleccionado = item;
  }

  cerrarModal(): void {
    this.itemSeleccionado = null;
    this.generoSeleccionado = '';  
    this.mostrarGeneros = true;     
  }

  private cargarGenerosTMDB(): void {
    const urlMovies = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=es-ES`;
    const urlTV = `${this.baseUrl}/genre/tv/list?api_key=${this.apiKey}&language=es-ES`;

    this.http.get<any>(urlMovies).subscribe(data => {
      (data.genres || []).forEach((g: any) => {
        this.generosIds[g.name] = g.id;
      });
    });

    this.http.get<any>(urlTV).subscribe(data => {
      (data.genres || []).forEach((g: any) => {
        this.generosIds[g.name] = g.id;
      });
    });
  }
}
