import { TestBed, inject } from '@angular/core/testing';

import { ObjectcreateService } from './objectcreate.service';

describe('ObjectcreateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectcreateService]
    });
  });

  it('should be created', inject([ObjectcreateService], (service: ObjectcreateService) => {
    expect(service).toBeTruthy();
  }));
});
