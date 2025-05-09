import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntosventaListaComponent } from './puntosventa-lista.component';

describe('PuntosventaListaComponent', () => {
  let component: PuntosventaListaComponent;
  let fixture: ComponentFixture<PuntosventaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuntosventaListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PuntosventaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
