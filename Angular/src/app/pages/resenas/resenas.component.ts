import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ResenasService, Resena } from '../../services/resenas.service';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resenas.component.html',
  styleUrls: ['./resenas.component.css']
})
export class ResenasComponent implements OnInit {
  cargando = true;
  resenas: Resena[] = [];

  private tipos: Array<'libro' | 'serie' | 'pelicula'> | null = null;

  constructor(
    private resenasService: ResenasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;

    if (path === 'resenas-libros') this.tipos = ['libro'];
    else if (path === 'resenas-series') this.tipos = ['serie'];
    else if (path === 'resenas-peliculas') this.tipos = ['pelicula'];
    else if (path === 'resenas-series-peliculas') this.tipos = ['serie', 'pelicula'];
    else this.tipos = null;

    this.cargar();
  }

  cargar(): void {
    this.cargando = true;

    if (this.tipos && this.tipos.length === 1) {
      this.resenasService.obtenerRecientes(this.tipos[0]).subscribe({
        next: (data) => {
          this.resenas = data ?? [];
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error cargando reseñas', err);
          this.resenas = [];
          this.cargando = false;
        }
      });
      return;
    }

    this.resenasService.obtenerRecientes(undefined).subscribe({
      next: (data) => {
        const all = data ?? [];
        this.resenas = this.tipos ? all.filter(r => this.tipos!.includes(r.tipo)) : all;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando reseñas', err);
        this.resenas = [];
        this.cargando = false;
      }
    });
  }

  linkDetalle(r: Resena): any[] {
    if (r.tipo === 'libro') return ['/busqueda-libro', r.itemId];
    if (r.tipo === 'serie') return ['/series/detalle/serie', r.itemId];
    return ['/series/detalle/pelicula', r.itemId];
  }
}
