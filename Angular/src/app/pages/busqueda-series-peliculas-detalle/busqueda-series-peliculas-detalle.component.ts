import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-busqueda-series-peliculas-detalle',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './busqueda-series-peliculas-detalle.component.html',
  styleUrls: ['./busqueda-series-peliculas-detalle.component.css']
})
export class BusquedaSeriesPeliculasDetalleComponent implements OnInit {

  item: any;
  posterUrl: string = '';

  mostrarModal = false;
  estadoSeleccionado = 'viendo';
  puntuacion = 1;

  esSerie = false; 
  temporada: number = 1;
  capitulo: number = 1;

  private apiUrl = 'http://localhost:8080/api/series-usuarios';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const tipo = this.route.snapshot.paramMap.get('tipo'); // 'serie' o 'pelicula'

    this.esSerie = tipo === 'serie';

    if (id && tipo) {
      this.obtenerDetalles(id, tipo);
    }
  }

  obtenerDetalles(id: string, tipo: string) {
    const api_key = '218315c8512d576a1f186b27b8d7538e';

    const url = tipo === 'serie'
      ? `https://api.themoviedb.org/3/tv/${id}?api_key=${api_key}&language=es`
      : `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=es`;

    this.http.get(url).subscribe((data: any) => {
      this.item = data;
      this.posterUrl = data.poster_path
        ? 'https://image.tmdb.org/t/p/w500' + data.poster_path
        : 'assets/images/imagenNoDisponible.png';
    });
  }

  abrirModal() {
    if (!this.authService.estaLogueado()) {
      alert('Debes iniciar sesión para poder guardar.');
      return;
    }

    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarItem() {
  const usuarioId = this.authService.getUsuarioId();

  if (!usuarioId) {
    alert('Debes iniciar sesión.');
    this.mostrarModal = false;
    return;
  }

  const body = {
    usuarioId: usuarioId,  // ✅ CORRECTO
    itemId: this.item.id,
    titulo: this.item.name || this.item.title,
    tipo: this.esSerie ? 'serie' : 'pelicula',
    estado: this.estadoSeleccionado,
    puntuacion: this.puntuacion,
    temporada: this.esSerie ? this.temporada : null,
    capitulo: this.esSerie ? this.capitulo : null
  };

  this.http.post(this.apiUrl, body).subscribe({
    next: () => {
      alert('Guardado correctamente');
      this.cerrarModal();
    },
    error: err => {
      console.error(err);
      alert('Error al guardar');
    }
  });
}
reemplazarImagen(event: any) {
  event.target.src = 'assets/images/imagenNoDisponible.png';
}

}
