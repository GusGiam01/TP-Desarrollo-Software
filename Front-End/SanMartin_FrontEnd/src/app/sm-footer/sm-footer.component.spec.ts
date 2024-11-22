import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmFooterComponent } from './sm-footer.component';

describe('SmFooterComponent', () => {
  let component: SmFooterComponent;
  let fixture: ComponentFixture<SmFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
