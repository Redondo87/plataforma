import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaSeriesPeliculasComponent } from './busqueda-series-peliculas.component';

describe('BusquedaSeriesPeliculasComponent', () => {
  let component: BusquedaSeriesPeliculasComponent;
  let fixture: ComponentFixture<BusquedaSeriesPeliculasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaSeriesPeliculasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusquedaSeriesPeliculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
