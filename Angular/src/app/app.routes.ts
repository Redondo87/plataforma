import { Routes } from '@angular/router';
import { LibroDetalleComponent } from './pages/libro-detalle/libro-detalle.component';
import { SerieDetalleComponent } from './pages/serie-detalle/serie-detalle.component';
import { HomePageComponent } from './pages/home-page.component';
import { BusquedaLibrosComponent } from './pages/busqueda-libros/busqueda-libros.component';
import { BusquedaLibroDetalleComponent } from './pages/busqueda-libro-detalle/busqueda-libro-detalle.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'libro/:id',
    component: LibroDetalleComponent
  },
  {
    path: 'serie/:tipo/:id',
    component: SerieDetalleComponent
  },
  {
    path: 'busqueda-libros',
    component: BusquedaLibrosComponent
  },

  { path: 'busqueda-libro/:id', 
    component: BusquedaLibroDetalleComponent
  }
];
