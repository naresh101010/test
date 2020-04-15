import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectdetailComponent } from './objectdetail.component';

describe('ObjectdetailComponent', () => {
  let component: ObjectdetailComponent;
  let fixture: ComponentFixture<ObjectdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
