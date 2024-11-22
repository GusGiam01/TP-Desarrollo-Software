import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SMHeaderComponent } from './sm-header.component';

describe('SMHeaderComponent', () => {
  let component: SMHeaderComponent;
  let fixture: ComponentFixture<SMHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SMHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SMHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
