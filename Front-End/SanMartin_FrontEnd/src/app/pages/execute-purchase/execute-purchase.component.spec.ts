import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutePurchaseComponent } from './execute-purchase.component';

describe('ExecutePurchaseComponent', () => {
  let component: ExecutePurchaseComponent;
  let fixture: ComponentFixture<ExecutePurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutePurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecutePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
