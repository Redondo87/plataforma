import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-busqueda-series-peliculas-detalle',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './busqueda-series-peliculas-detalle.component.html',
  styleUrls: ['./busqueda-series-peliculas-detalle.component.css']
})
export class BusquedaSeriesPeliculasDetalleComponent implements OnInit {
  detalle: any = null;
  tipo: string = '';
  id: string = '';
  apiKey: string = '218315c8512d576a1f186b27b8d7538e';
  baseUrl: string = 'https://api.themoviedb.org/3';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.tipo = this.route.snapshot.paramMap.get('tipo') || 'movie';
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.cargarDetalle();
    }
  }

  cargarDetalle(): void {
  const url = `${this.baseUrl}/${this.tipo}/${this.id}?api_key=${this.apiKey}&language=es-ES&append_to_response=credits`;
  this.http.get<any>(url).subscribe({
    next: data => {
      const creadores =
        (data.credits?.crew || [])
          .filter((c: any) => /creator|director|writer/i.test(c.job || c.department || ''))
          .slice(0, 3)
          .map((c: any) => c.name)
          .join(', ') ||
        (data.created_by ? data.created_by.map((c: any) => c.name).join(', ') : 'Desconocido');

      this.detalle = {
        titulo: data.title || data.name || 'Sin título',
        descripcion: data.overview || 'Sin descripción disponible.',
        portada: data.poster_path
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
          : 'assets/no-image.jpg',
        generos: (data.genres || []).map((g: any) => g.name).join(', ') || 'N/A',
        fecha: data.release_date || data.first_air_date || 'Desconocida',
        creadores
      };
    },
    error: err => {
      console.error('Error cargando detalle TMDB', err);
    }
  });
}


  volver(): void {
    this.router.navigate(['/series/busqueda']);
  }

  anadirAMiLista(): void {
    // implementar guardado real con backend o localStorage
    const miLista = JSON.parse(localStorage.getItem('miLista') || '[]');
    miLista.push({ id: this.id, tipo: this.tipo, titulo: this.detalle?.titulo });
    localStorage.setItem('miLista', JSON.stringify(miLista));
    alert('Añadido a tu lista');
  }
}
