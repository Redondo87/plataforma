import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibrosService } from '../../services/libros.service';
import { CommonModule } from '@angular/common'; // <-- IMPORTANTE
import { RouterModule } from '@angular/router'; // opcional, si usas routerLink

@Component({
  selector: 'app-libro-detalle',
  standalone: true, // <-- NECESARIO
  imports: [CommonModule, RouterModule], // <-- NECESARIO
  templateUrl: './libro-detalle.component.html',
  styleUrls: ['./libro-detalle.component.css']
})
export class LibroDetalleComponent implements OnInit {
  libro: any;

  constructor(private route: ActivatedRoute, private librosService: LibrosService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.librosService.obtenerLibroPorId(id).subscribe(data => {
        this.libro = data;
      });
    }
  }
 comprarLibro() {
  console.log('Comprar libro:', this.libro);
}


}
