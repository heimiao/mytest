import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderinfoComponent } from './orderinfo.component';

describe('OrderinfoComponent', () => {
  let component: OrderinfoComponent;
  let fixture: ComponentFixture<OrderinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
