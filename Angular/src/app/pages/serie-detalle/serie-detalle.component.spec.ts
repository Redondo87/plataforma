import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieDetalleComponent } from './serie-detalle.component';

describe('SerieDetalleComponent', () => {
  let component: SerieDetalleComponent;
  let fixture: ComponentFixture<SerieDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerieDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
