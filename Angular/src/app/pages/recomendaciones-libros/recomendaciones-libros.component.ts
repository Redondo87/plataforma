import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RecomendacionesService, RecomendacionLibro } from '../../services/recomendaciones.service';

@Component({
  selector: 'app-recomendaciones-libros',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './recomendaciones-libros.component.html',
  styleUrls: ['./recomendaciones-libros.component.css']
})
export class RecomendacionesLibrosComponent implements OnInit {
  cargando = true;
  libros: RecomendacionLibro[] = [];

  constructor(private recService: RecomendacionesService) {}

  ngOnInit(): void {
    this.cargando = true;

    this.recService.getLibrosRecomendados().subscribe({
      next: (data) => {
        this.libros = data ?? [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando recomendaciones libros', err);
        this.libros = [];
        this.cargando = false;
      }
    });
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement | null;
    if (img) img.src = '/assets/images/imagenNoDisponible.png';
  }

  reemplazarImagen(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/assets/images/imagenNoDisponible.png';
}

}
