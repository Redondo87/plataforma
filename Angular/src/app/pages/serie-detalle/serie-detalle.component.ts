import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeriesService } from '../../services/series.service';

@Component({
  selector: 'app-serie-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './serie-detalle.component.html',
  styleUrls: ['./serie-detalle.component.css']
})
export class SerieDetalleComponent implements OnInit {
  serie: any;
  tipo: string = 'tv';

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService
  ) {}

  ngOnInit(): void {
    const tipo = this.route.snapshot.paramMap.get('tipo') as 'tv' | 'movie';
    const id = this.route.snapshot.paramMap.get('id');

    if (tipo && id) {
      this.tipo = tipo;

      this.seriesService.obtenerDetalle(tipo, id).subscribe(data => {
        this.serie = data;
         console.log('Proveedores de streaming:', this.serie.streamingProviders);
      });
    }
  }

getProveedorUrl(nombre: string): string {
  const normalized = nombre.toLowerCase().replace(/\s+/g, '');

  if (normalized.includes('netflix')) return 'https://www.netflix.com';
  if (normalized.includes('hbomax') || normalized.includes('hbo')) return 'https://www.hbomax.com';
  if (normalized.includes('disney')) return 'https://www.disneyplus.com';
  if (normalized.includes('prime') || normalized.includes('amazon')) return 'https://www.primevideo.com';
  if (normalized.includes('apple')) return 'https://tv.apple.com';
  if (normalized.includes('filmin')) return 'https://www.filmin.es';
  if (normalized.includes('movistar')) return 'https://ver.movistarplus.es/';
  if (normalized.includes('skyshowtime')) return 'https://www.skyshowtime.com';
  if (normalized.includes('rakuten')) return 'https://rakuten.tv';
  if (normalized.includes('atresplayer')) return 'https://www.atresplayer.com';

  return 'https://www.google.com/search?q=' + encodeURIComponent(nombre + ' ver online');
}

}
