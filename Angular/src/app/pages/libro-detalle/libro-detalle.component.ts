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
  libro: any;

  constructor(
    private route: ActivatedRoute,
    private librosService: LibrosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.librosService.obtenerLibroPorId(id).subscribe({
        next: (data) => this.libro = data,
        error: (err) => {
          console.error('Error cargando libro', err);
          this.libro = null;
        }
      });
    }
  }

  abrirEnGoogleBooks() {
    if (!this.libro) return;

    const buyLink = this.libro?.saleInfo?.buyLink;              
    const infoLink = this.libro?.volumeInfo?.infoLink;          
    const previewLink = this.libro?.volumeInfo?.previewLink;    
    const id = this.libro?.id;
    const title = this.libro?.volumeInfo?.title;

    const url =
      buyLink ||
      infoLink ||
      previewLink ||
      (id ? `https://play.google.com/store/books/details?id=${encodeURIComponent(id)}&hl=es` : null) ||
      `https://play.google.com/store/search?q=${encodeURIComponent(title || 'books')}&c=books&hl=es`;

    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
