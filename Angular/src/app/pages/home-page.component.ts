import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LibrosService } from '../services/libros.service';
import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  // 📚 Libros (backend propio)
  topLibros: any[] = [];
  cargandoLibros = true;

  // 🎬 Películas
  upcomingMovies: any[] = [];
  cargandoPeliculas = true;

  // 📺 Series
  airingTodaySeries: any[] = [];
  cargandoSeries = true;

  constructor(
    private librosService: LibrosService,
    private tmdbService: TmdbService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTopLibros();
    this.cargarPeliculas();
    this.cargarSeries();
  }

  // ------------------- LIBROS -------------------
  cargarTopLibros() {
    this.cargandoLibros = true;
    this.librosService.obtenerTopLibros().subscribe({
      next: data => {
        this.topLibros = data.slice(0, 5);
        this.cargandoLibros = false;
      },
      error: err => {
        console.error('Error cargando libros', err);
        this.topLibros = [];
        this.cargandoLibros = false;
      }
    });
  }

  // ------------------- PELÍCULAS -------------------
  cargarPeliculas() {
    this.tmdbService.upcomingMovies(5).subscribe({
      next: data => {
        this.upcomingMovies = data;
        this.cargandoPeliculas = false;
      },
      error: () => this.cargandoPeliculas = false
    });
  }

  // ------------------- SERIES -------------------
  cargarSeries() {
    this.tmdbService.airingTodaySeries(5).subscribe({
      next: data => {
        this.airingTodaySeries = data;
        this.cargandoSeries = false;
      },
      error: () => this.cargandoSeries = false
    });
  }

  // ------------------- NAVEGACIÓN -------------------
  irBusquedaLibros() {
    this.router.navigate(['/mejores-libros']);
  }

  irBusquedaSeries() {
    this.router.navigate(['/series/mejores']);
  }
}
