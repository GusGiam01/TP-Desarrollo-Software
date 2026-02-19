import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseUnavailableComponent } from './database-unavailable.component';

describe('DatabaseUnavailableComponent', () => {
  let component: DatabaseUnavailableComponent;
  let fixture: ComponentFixture<DatabaseUnavailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseUnavailableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseUnavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
