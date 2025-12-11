import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeriesService } from '../../services/series.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mejores-series-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mejores-series-peliculas.component.html',
  styleUrls: ['./mejores-series-peliculas.component.css']
})
export class MejoresSeriesPeliculasComponent implements OnInit {

  mejoresSeries: any[] = [];
  cargando = false;
  error = '';

  mostrarModal = false;
  serieSeleccionada: any = null;
  estadoSeleccionado = 'viendo';
  puntuacion: number = 1;

  constructor(
    private seriesService: SeriesService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarTopSeries();
  }

  cargarTopSeries() {
    this.cargando = true;
    this.error = '';

    this.seriesService.obtenerMejoresSeries().subscribe({
      next: (seriesTop: any[]) => {
        
        this.mejoresSeries = seriesTop;

        // Si NO está logueado → No cargar puntuación del usuario
        if (!this.estaLogueado) {
          this.cargando = false;
          return;
        }

        const usuarioId = this.authService.getUsuarioId();
        if (!usuarioId) {
          this.cargando = false;
          return;
        }

        // Traer puntuaciones del usuario
        this.seriesService.obtenerSeriesUsuario(usuarioId).subscribe({
          next: (misSeries: any[]) => {

            this.mejoresSeries = this.mejoresSeries.map(s => {
              const registro = misSeries.find(m => m.itemId == s.id);
              return {
                ...s,
                miPuntuacion: registro ? registro.puntuacion : null
              };
            });

            this.cargando = false;
          },
          error: err => {
            console.error('Error cargando puntuación del usuario', err);
            this.cargando = false;
          }
        });

      },
      error: err => {
        console.error(err);
        this.error = 'Error al cargar las series/películas';
        this.cargando = false;
      }
    });
  }

  abrirModal(serie: any) {
    if (!this.estaLogueado) {
      alert('Debes iniciar sesión para añadir series/películas.');
      return;
    }

    this.serieSeleccionada = serie;
    this.mostrarModal = true;
    this.estadoSeleccionado = 'viendo';
    this.puntuacion = 1;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.serieSeleccionada = null;
  }

  guardarSerie() {
    if (!this.estaLogueado) {
      alert('Debes iniciar sesión para añadir series/películas.');
      return;
    }

    const datos = {
      usuarioId: this.authService.getUsuarioId(),
      itemId: this.serieSeleccionada.id,
      titulo: this.serieSeleccionada.titulo,
      tipo: this.serieSeleccionada.tipo || 'serie',
      estado: this.estadoSeleccionado,
      puntuacion: this.puntuacion,
      temporada: this.serieSeleccionada.temporada || null,
      capitulo: this.serieSeleccionada.capitulo || null
    };

    this.seriesService.guardarSerieUsuario(datos).subscribe({
      next: () => {
        alert('Serie/Película guardada correctamente');
        this.cerrarModal();
        this.cargarTopSeries(); // vuelve a cargar tu puntuación
      },
      error: err => {
        console.error(err);
        alert('Error al guardar la serie/película');
      }
    });
  }

  get estaLogueado() {
    return this.authService.estaLogueado();
  }
}
