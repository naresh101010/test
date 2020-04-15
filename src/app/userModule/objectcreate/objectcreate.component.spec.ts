import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectcreateComponent } from './objectcreate.component';

describe('ObjectcreateComponent', () => {
  let component: ObjectcreateComponent;
  let fixture: ComponentFixture<ObjectcreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectcreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
