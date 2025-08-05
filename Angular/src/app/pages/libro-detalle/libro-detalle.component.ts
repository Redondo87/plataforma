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
      this.librosService.obtenerLibroPorId(id).subscribe(data => {
        this.libro = data;
      });
    }
  }

  abrirEnGoogleBooks() {
    const url = this.libro.volumeInfo?.infoLink;
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('No se encontró el enlace a Google Books.');
    }
  }
}
