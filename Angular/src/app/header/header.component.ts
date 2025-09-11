import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() usuarioLogueado: boolean = false;
  @Input() nombreUsuario: string = '';

  @Output() toggleLoginEvent = new EventEmitter<void>();
  @Output() cerrarSesionEvent = new EventEmitter<void>();

  buscadorActivo = false;
  buscadorSeriesActivo = false;

  terminoLibro = '';
  resultadosLibros: any[] = [];

  terminoSerie = '';
  resultadosSeries: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buscadorActivo = false;
        this.buscadorSeriesActivo = false;
      });
  }

  toggleLogin() {
    this.toggleLoginEvent.emit();
  }

  cerrarSesion() {
    this.cerrarSesionEvent.emit();
  }

  toggleLibros() {
    this.buscadorActivo = !this.buscadorActivo;
    this.resultadosLibros = [];
    this.terminoLibro = '';
  }

  toggleSeries() {
    this.buscadorSeriesActivo = !this.buscadorSeriesActivo;
    this.resultadosSeries = [];
    this.terminoSerie = '';
  }

  buscarLibros() {
    const consulta = this.terminoLibro.trim();

    // 🔹 Solo buscar si hay mínimo 3 caracteres
    if (consulta.length < 3) {
      this.resultadosLibros = [];
      return;
    }

    const query = encodeURIComponent(consulta);
    const apiKey = 'AIzaSyACE882Krrh-9OQQFSddSDjzvbDyQZYZOg';
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

    this.http.get<any>(url).subscribe(res => {
      this.resultadosLibros = res.items || [];
    });
  }

  buscarSeries() {
    const consulta = this.terminoSerie.trim();

    // 🔹 Solo buscar si hay mínimo 3 caracteres
    if (consulta.length < 3) {
      this.resultadosSeries = [];
      return;
    }

    const query = encodeURIComponent(consulta);
    const apiKey = '218315c8512d576a1f186b27b8d7538e';
    const url = `https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${apiKey}&language=es`;

    this.http.get<any>(url).subscribe(res => {
      this.resultadosSeries = res.results || [];
    });
  }

  getPosterUrl(path: string | null): string {
    return path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : 'assets/images/imagenNoDisponible.png';
  }

  cerrarBuscadorLibros() {
    this.buscadorActivo = false;
    this.resultadosLibros = [];
    this.terminoLibro = '';
  }

  cerrarBuscadorSeries() {
    this.buscadorSeriesActivo = false;
    this.resultadosSeries = [];
    this.terminoSerie = '';
  }
}
