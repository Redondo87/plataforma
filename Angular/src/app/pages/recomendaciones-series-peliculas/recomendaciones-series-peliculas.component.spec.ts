import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendacionesSeriesPeliculasComponent } from './recomendaciones-series-peliculas.component';

describe('RecomendacionesSeriesPeliculasComponent', () => {
  let component: RecomendacionesSeriesPeliculasComponent;
  let fixture: ComponentFixture<RecomendacionesSeriesPeliculasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendacionesSeriesPeliculasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendacionesSeriesPeliculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
