import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  // Libros 
  topLibros: any[] = [];
  cargandoLibros = true;

  // Películas 
  topMovies: any[] = [];
  cargandoPeliculas = true;

  // Series 
  topSeries: any[] = [];
  cargandoSeries = true;

  constructor(
    private http: HttpClient,
    private tmdb: TmdbService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarLibros();
    this.cargarTopPeliculas();
    this.cargarTopSeries();
  }

  // LIBROS 
  cargarLibros() {
    this.cargandoLibros = true;

    this.http
      .get<any[]>('http://localhost:8080/api/libros-usuarios/top')
      .subscribe({
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

  // PELÍCULAS 
  cargarTopPeliculas() {
    this.tmdb.topRatedMovies(5).subscribe({
      next: data => {
        this.topMovies = data;
        this.cargandoPeliculas = false;
      },
      error: err => {
        console.error('Error cargando películas', err);
        this.topMovies = [];
        this.cargandoPeliculas = false;
      }
    });
  }

  //SERIES
  cargarTopSeries() {
    this.tmdb.topRatedSeries(5).subscribe({
      next: data => {
        this.topSeries = data;
        this.cargandoSeries = false;
      },
      error: err => {
        console.error('Error cargando series', err);
        this.topSeries = [];
        this.cargandoSeries = false;
      }
    });
  }

  //NAVEGACIÓN
  verDetallePelicula(id: number) {
    this.router.navigate(['/series/detalle/movie', id]);
  }

  verDetalleSerie(id: number) {
    this.router.navigate(['/series/detalle/tv', id]);
  }
}
