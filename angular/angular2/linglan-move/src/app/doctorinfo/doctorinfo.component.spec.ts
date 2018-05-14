import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorinfoComponent } from './doctorinfo.component';

describe('DoctorinfoComponent', () => {
  let component: DoctorinfoComponent;
  let fixture: ComponentFixture<DoctorinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
