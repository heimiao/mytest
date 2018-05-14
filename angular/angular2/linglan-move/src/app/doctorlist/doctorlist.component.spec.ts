import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorlistComponent } from './doctorlist.component';

describe('DoctorlistComponent', () => {
  let component: DoctorlistComponent;
  let fixture: ComponentFixture<DoctorlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
