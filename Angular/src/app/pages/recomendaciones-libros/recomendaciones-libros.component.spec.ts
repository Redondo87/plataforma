import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendacionesLibrosComponent } from './recomendaciones-libros.component';

describe('RecomendacionesLibrosComponent', () => {
  let component: RecomendacionesLibrosComponent;
  let fixture: ComponentFixture<RecomendacionesLibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendacionesLibrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendacionesLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
