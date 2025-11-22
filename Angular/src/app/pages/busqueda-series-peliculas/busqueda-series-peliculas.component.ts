import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-busqueda-series-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './busqueda-series-peliculas.component.html',
  styleUrls: ['./busqueda-series-peliculas.component.css']
})
export class BusquedaSeriesPeliculasComponent implements OnInit {

  terminoBusqueda = '';
  generoSeleccionado = '';
  generosTMDB: string[] = [];      
  resultadosFiltrados: any[] = [];
  itemSeleccionado: any = null;
  mostrarGeneros = true;

  sugerencias: any[] = [];
  mostrarSugerencias = false;
  private debounceTimer: any = null;

  estadoSeleccionado = 'en espera';
  puntuacion: number | null = null;
  temporada: number | null = null;
  capitulo: number | null = null;

  private generosIds: { [key: string]: number } = {};
  private apiKey = '218315c8512d576a1f186b27b8d7538e';
  private baseUrl = 'https://api.themoviedb.org/3';

  guardarUrl = 'http://localhost:8080/api/lista/guardar';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarGenerosTMDB();
  }

  onInput(): void {
    if (this.terminoBusqueda.trim().length < 3) {
      this.sugerencias = [];
      this.mostrarSugerencias = false;
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
        this.sugerencias = (data.results || []).slice(0, 10).map((item: any) => ({
          id: item.id,
          media_type: item.media_type,
          titulo: item.title || item.name || 'Sin título',
          descripcion: item.overview || '',
          portada: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'assets/no-image.jpg',
          creadores: item.media_type === 'tv' ? 'Serie' : 'Película'
        }));

        this.mostrarSugerencias = this.sugerencias.length > 0;
      },
      error: err => console.error('Error TMDB sugerencias:', err)
    });
  }

  irADetalle(item: any): void {
    if (!item || !item.id) return;

    this.mostrarSugerencias = false;

    this.router.navigate([
      '/series/detalle',
      item.media_type === 'tv' ? 'serie' : 'pelicula',
      item.id
    ]);
  }

  filtrarPorGenero(genero: string): void {
    this.generoSeleccionado = genero;
    this.mostrarGeneros = false;

    const generoId = this.generosIds[genero];

    if (!generoId) {
      console.warn('Género no existe en TMDB:', genero);
      this.resultadosFiltrados = [];
      return;
    }

    const urlMovies = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${generoId}&language=es-ES`;
    const urlTV = `${this.baseUrl}/discover/tv?api_key=${this.apiKey}&with_genres=${generoId}&language=es-ES`;

    // Películas
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

        // Series
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

  abrirModal(item: any): void {
    this.itemSeleccionado = item;
  }

  cerrarModal(): void {
    this.itemSeleccionado = null;
  }

  guardarItem(): void {
    const usuario = this.authService.getUsuario();
    if (!usuario || !usuario.id) {
      alert('Debes iniciar sesión para guardar.');
      return;
    }

    if (!this.itemSeleccionado) return;

    const payload: any = {
      usuarioId: usuario.id,
      itemId: this.itemSeleccionado.id,
      tipo: this.itemSeleccionado.media_type === 'tv' ? 'serie' : 'pelicula',
      estado: this.estadoSeleccionado,
      puntuacion: this.puntuacion,
      titulo: this.itemSeleccionado.titulo

    };

    if (this.itemSeleccionado.media_type === 'tv') {
      payload.temporada = this.temporada;
      payload.capitulo = this.capitulo;
    }

    this.http.post(this.guardarUrl, payload).subscribe({
      next: () => {
        alert('Guardado correctamente.');
        this.cerrarModal();
      },
      error: err => console.error('Error guardando:', err)
    });
  }

  private cargarGenerosTMDB(): void {
    const urlMovies = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=es-ES`;
    const urlTV = `${this.baseUrl}/genre/tv/list?api_key=${this.apiKey}&language=es-ES`;

    this.http.get<any>(urlMovies).subscribe(data => {
      (data.genres || []).forEach((g: any) => {
        this.generosIds[g.name] = g.id;
        if (!this.generosTMDB.includes(g.name)) {
          this.generosTMDB.push(g.name);
        }
      });
    });

    this.http.get<any>(urlTV).subscribe(data => {
      (data.genres || []).forEach((g: any) => {
        this.generosIds[g.name] = g.id;
        if (!this.generosTMDB.includes(g.name)) {
          this.generosTMDB.push(g.name);
        }
      });
    });
  }

}
