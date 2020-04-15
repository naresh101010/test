import { TestBed, inject } from '@angular/core/testing';

import { ObjectdetailService } from './objectdetail.service';

describe('ObjectdetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectdetailService]
    });
  });

  it('should be created', inject([ObjectdetailService], (service: ObjectdetailService) => {
    expect(service).toBeTruthy();
  }));
});
