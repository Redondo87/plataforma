import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const tipo = this.route.snapshot.paramMap.get('tipo');
    const id = this.route.snapshot.paramMap.get('id');

    if (tipo && id) {
      this.tipo = tipo;
      const apiKey = '218315c8512d576a1f186b27b8d7538e';
      const url = `https://api.themoviedb.org/3/${tipo}/${id}?api_key=${apiKey}&language=es`;

      this.http.get(url).subscribe(data => {
        this.serie = data;
      });
    }
  }
}
