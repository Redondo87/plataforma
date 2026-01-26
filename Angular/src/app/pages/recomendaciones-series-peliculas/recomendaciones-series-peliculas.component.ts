import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RecomendacionesService, RecomendacionMedia } from '../../services/recomendaciones.service';

@Component({
  selector: 'app-recomendaciones-series-peliculas',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './recomendaciones-series-peliculas.component.html',
  styleUrls: ['./recomendaciones-series-peliculas.component.css']
})
export class RecomendacionesSeriesPeliculasComponent implements OnInit {
  cargando = true;

  pestana: 'series' | 'peliculas' = 'peliculas';
  items: RecomendacionMedia[] = [];

  constructor(private recService: RecomendacionesService) {}

  ngOnInit(): void {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.pestana = 'peliculas';
    this.cargando = true;

    this.recService.getTrendingPeliculas().subscribe({
      next: (data) => {
        this.items = data ?? [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando películas recomendadas', err);
        this.items = [];
        this.cargando = false;
      }
    });
  }

  cargarSeries() {
    this.pestana = 'series';
    this.cargando = true;

    this.recService.getTrendingSeries().subscribe({
      next: (data) => {
        this.items = data ?? [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando series recomendadas', err);
        this.items = [];
        this.cargando = false;
      }
    });
  }

  linkDetalle(it: RecomendacionMedia): any[] {
    return it.tipo === 'serie'
      ? ['/series/detalle/serie', it.id]
      : ['/series/detalle/pelicula', it.id];
  }
}
