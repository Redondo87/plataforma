import { Routes } from '@angular/router';
import { LibroDetalleComponent } from './pages/libro-detalle/libro-detalle.component';
import { SerieDetalleComponent } from './pages/serie-detalle/serie-detalle.component';
import { HomePageComponent } from './pages/home-page.component';

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
}
];
