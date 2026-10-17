import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendUsMailComponent } from './send-us-mail.component';

describe('SendUsMailComponent', () => {
  let component: SendUsMailComponent;
  let fixture: ComponentFixture<SendUsMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendUsMailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendUsMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
