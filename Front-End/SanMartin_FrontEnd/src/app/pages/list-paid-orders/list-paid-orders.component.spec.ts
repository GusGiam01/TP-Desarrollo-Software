import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaidOrdersComponent } from './list-paid-orders.component';

describe('ListPaidOrdersComponent', () => {
  let component: ListPaidOrdersComponent;
  let fixture: ComponentFixture<ListPaidOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPaidOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPaidOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
