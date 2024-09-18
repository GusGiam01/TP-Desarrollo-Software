import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmProductComponent } from './sm-product.component';

describe('SmProductComponent', () => {
  let component: SmProductComponent;
  let fixture: ComponentFixture<SmProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
