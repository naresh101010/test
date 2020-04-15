import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolldetailComponent } from './rolldetail.component';

describe('RolldetailComponent', () => {
  let component: RolldetailComponent;
  let fixture: ComponentFixture<RolldetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolldetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolldetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
