import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MejoresLibrosComponent } from './mejores-libros.component';

describe('MejoresLibrosComponent', () => {
  let component: MejoresLibrosComponent;
  let fixture: ComponentFixture<MejoresLibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MejoresLibrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MejoresLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
