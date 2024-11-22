import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexVideoComponent } from './index-video.component';

describe('IndexVideoComponent', () => {
  let component: IndexVideoComponent;
  let fixture: ComponentFixture<IndexVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexVideoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndexVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
