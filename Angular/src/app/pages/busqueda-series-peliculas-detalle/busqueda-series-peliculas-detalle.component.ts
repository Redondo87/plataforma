import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeriesService } from '../../services/series.service';
import { AuthService } from '../../services/auth.service';
import { ResenasService, Resena } from '../../services/resenas.service';

@Component({
  selector: 'app-busqueda-series-peliculas-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busqueda-series-peliculas-detalle.component.html',
  styleUrls: ['./busqueda-series-peliculas-detalle.component.css']
})
export class BusquedaSeriesPeliculasDetalleComponent implements OnInit {

  item: any = null;
  posterUrl: string = 'assets/images/imagenNoDisponible.png';

  mostrarModal = false;
  estadoSeleccionado = 'viendo';
  puntuacion = 1;

  esSerie = false;
  temporada: number = 1;
  capitulo: number = 1;

  resenas: Resena[] = [];
  nuevaResena: string = '';

  private itemId: string = '';
  private tipoResena: 'serie' | 'pelicula' = 'serie';

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    public authService: AuthService,
    private resenasService: ResenasService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const tipo = this.route.snapshot.paramMap.get('tipo');

    this.esSerie = tipo === 'serie';

    if (id && tipo) {
      this.itemId = id;
      this.tipoResena = tipo === 'pelicula' ? 'pelicula' : 'serie';
      this.obtenerDetalles(id, tipo);
    }
  }

  obtenerDetalles(id: string, tipo: string) {

    const tipoTmdb: 'tv' | 'movie' = tipo === 'serie' ? 'tv' : 'movie';

    this.seriesService.obtenerDetalle(tipoTmdb, id).subscribe({
      next: (data: any) => {
        this.item = data;
        this.posterUrl = data?.poster_path
          ? 'https://image.tmdb.org/t/p/w500' + data.poster_path
          : 'assets/images/imagenNoDisponible.png';
      },
      error: (err) => console.error('Error cargando detalles', err)
    });
  }

  reemplazarImagen(event: any) {
    event.target.src = 'assets/images/imagenNoDisponible.png';
  }

  abrirModal() {
    if (!this.authService.estaLogueado()) {
      alert('Debes iniciar sesión para poder guardar.');
      return;
    }

    this.mostrarModal = true;
    this.cargarResenas();
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarItem() {
    const usuarioId = this.authService.getUsuarioId();

    if (!usuarioId) {
      alert('Debes iniciar sesión.');
      this.mostrarModal = false;
      return;
    }

    const body = {
      usuarioId: usuarioId,
      itemId: this.item.id,
      titulo: this.item.name || this.item.title,
      tipo: this.esSerie ? 'serie' : 'pelicula',
      estado: this.estadoSeleccionado,
      puntuacion: this.puntuacion,
      temporada: this.esSerie ? this.temporada : null,
      capitulo: this.esSerie ? this.capitulo : null
    };

    this.seriesService.guardarSerieUsuario(body).subscribe({
      next: () => {
        alert('Guardado correctamente');
        this.cerrarModal();
      },
      error: err => {
        console.error(err);
        alert('Error al guardar');
      }
    });
  }

  cargarResenas() {
    this.resenasService.obtenerResenas(this.tipoResena, this.itemId).subscribe({
      next: (data: Resena[]) => this.resenas = data,
      error: (err) => console.error('Error cargando reseñas', err)
    });
  }

  guardarResena() {
    const usuarioId = this.authService.getUsuarioId();

    if (!usuarioId) {
      alert('Debes iniciar sesión para escribir una reseña.');
      return;
    }

    const texto = this.nuevaResena.trim();
    if (!texto) return;

    const resena: Resena = {
      usuarioId,
      tipo: this.tipoResena,
      itemId: this.itemId,
      contenido: texto,
      imagenUrl: this.posterUrl || 'assets/images/imagenNoDisponible.png'
    };

    this.resenasService.crearResena(resena).subscribe({
      next: () => {
        this.nuevaResena = '';
        this.cargarResenas();
      },
      error: (err) => {
        console.error('Error guardando reseña', err);
        alert('Error guardando reseña');
      }
    });
  }
}