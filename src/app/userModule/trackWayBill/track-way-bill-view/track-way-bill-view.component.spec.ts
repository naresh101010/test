import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackWayBillViewComponent } from './track-way-bill-view.component';

describe('TrackWayBillViewComponent', () => {
  let component: TrackWayBillViewComponent;
  let fixture: ComponentFixture<TrackWayBillViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackWayBillViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackWayBillViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
