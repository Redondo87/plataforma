// src/app/pages/busqueda-libro-detalle/busqueda-libro-detalle.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-busqueda-libro-detalle',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './busqueda-libro-detalle.component.html',
  styleUrls: ['./busqueda-libro-detalle.component.css']
})
export class BusquedaLibroDetalleComponent implements OnInit {
  libro: any = null;
  private apiKey = 'AIzaSyACE882Krrh-9OQQFSddSDjzvbDyQZYZOg';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerLibro(id);
    }
  }

  obtenerLibro(id: string) {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${this.apiKey}&langRestrict=es`;

    this.http.get<any>(url).subscribe(data => {
      const info = data.volumeInfo;
      this.libro = {
        titulo: info.title,
        autor: info.authors?.join(', ') || 'Autor desconocido',
        descripcion: info.description || 'Sin descripción disponible',
        imagen: info.imageLinks?.thumbnail || 'assets/imagen-no-disponible.jpg',
      
      };
    });
  }
}
