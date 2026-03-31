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
  private baseUrl = 'http://localhost:8080/api/recomendaciones';

  guardarUrl = 'http://localhost:8080/api/lista/guardar';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarGenerosTMDB();
  }

  // ================= BUSCADOR =================

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
    this.http
      .get<any>(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`)
      .subscribe({
        next: data => {
          this.sugerencias = (data.results || []).slice(0, 10).map((item: any) => ({
            id: item.id,
            media_type: item.media_type,
            titulo: item.title || item.name || 'Sin título',
            descripcion: item.overview || '',
            portada: item.poster_path
              ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
              : 'assets/no-image.jpg',
            creadores: item.media_type === 'tv' ? 'Serie' : 'Película'
          }));

          this.mostrarSugerencias = this.sugerencias.length > 0;
        },
        error: err => console.error('Error sugerencias:', err)
      });
  }

  irADetalle(item: any): void {
    if (!item || !item.id) return;

    this.mostrarSugerencias = false;

    this.router.navigate([
      '/series/detalle',
      item.media_type,
      item.id
    ]);
  }

  // ================= FILTRAR POR GÉNERO =================

  filtrarPorGenero(genero: string): void {
    this.generoSeleccionado = genero;
    this.mostrarGeneros = false;

    const generoId = this.generosIds[genero];
    if (!generoId) return;

    this.http
      .get<any>(`${this.baseUrl}/discover/movies?genreId=${generoId}`)
      .subscribe(dataMovies => {

        const peliculas = (dataMovies.results || []).map((item: any) => ({
          id: item.id,
          media_type: 'movie',
          titulo: item.title,
          descripcion: item.overview,
          portada: item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : 'assets/no-image.jpg',
          creadores: 'Película'
        }));

        this.http
          .get<any>(`${this.baseUrl}/discover/tv?genreId=${generoId}`)
          .subscribe(dataTV => {

            const series = (dataTV.results || []).map((item: any) => ({
              id: item.id,
              media_type: 'tv',
              titulo: item.name,
              descripcion: item.overview,
              portada: item.poster_path
                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                : 'assets/no-image.jpg',
              creadores: 'Serie'
            }));

            this.resultadosFiltrados = [...peliculas, ...series];
          });
      });
  }

  // ================= CARGAR GÉNEROS =================

  private cargarGenerosTMDB(): void {
    this.http.get<any>(`${this.baseUrl}/genres/movies`)
      .subscribe(data => {
        (data.genres || []).forEach((g: any) => {
          this.generosIds[g.name] = g.id;
          if (!this.generosTMDB.includes(g.name)) {
            this.generosTMDB.push(g.name);
          }
        });
      });

    this.http.get<any>(`${this.baseUrl}/genres/tv`)
      .subscribe(data => {
        (data.genres || []).forEach((g: any) => {
          this.generosIds[g.name] = g.id;
          if (!this.generosTMDB.includes(g.name)) {
            this.generosTMDB.push(g.name);
          }
        });
      });
  }

  // ================= MODAL =================

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

}