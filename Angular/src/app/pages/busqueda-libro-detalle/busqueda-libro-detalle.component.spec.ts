import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaLibroDetalleComponent } from './busqueda-libro-detalle.component';

describe('BusquedaLibroDetalleComponent', () => {
  let component: BusquedaLibroDetalleComponent;
  let fixture: ComponentFixture<BusquedaLibroDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaLibroDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusquedaLibroDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
