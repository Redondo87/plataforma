import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibrosService } from '../../services/libros.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './libro-detalle.component.html',
  styleUrls: ['./libro-detalle.component.css']
})
export class LibroDetalleComponent implements OnInit {

  libro: any = null;

  constructor(
    private route: ActivatedRoute,
    private librosService: LibrosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.librosService.obtenerLibroPorId(id).subscribe({
        next: (data) => {
          this.libro = data;
        },
        error: (err) => {
          console.error('Error cargando libro', err);
          this.libro = null;
        }
      });
    }
  }

  // 🔹 BOTÓN GOOGLE BOOKS → Va directo a la ficha oficial
  abrirEnGoogleBooks(): void {
    if (!this.libro?.id) {
      console.warn('No se encontró el ID del libro.');
      return;
    }

    const url = `https://books.google.com/books?id=${this.libro.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}