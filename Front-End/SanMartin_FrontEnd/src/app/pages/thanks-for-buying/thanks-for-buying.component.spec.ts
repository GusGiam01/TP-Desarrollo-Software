import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanksForBuyingComponent } from './thanks-for-buying.component';

describe('ThanksForBuyingComponent', () => {
  let component: ThanksForBuyingComponent;
  let fixture: ComponentFixture<ThanksForBuyingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThanksForBuyingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThanksForBuyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
