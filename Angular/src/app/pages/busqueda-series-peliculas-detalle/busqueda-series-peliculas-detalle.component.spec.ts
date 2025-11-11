import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaSeriesPeliculasDetalleComponent } from './busqueda-series-peliculas-detalle.component';

describe('BusquedaSeriesPeliculasDetalleComponent', () => {
  let component: BusquedaSeriesPeliculasDetalleComponent;
  let fixture: ComponentFixture<BusquedaSeriesPeliculasDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaSeriesPeliculasDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusquedaSeriesPeliculasDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
