import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MydoctorComponent } from './mydoctor.component';

describe('MydoctorComponent', () => {
  let component: MydoctorComponent;
  let fixture: ComponentFixture<MydoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MydoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MydoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
