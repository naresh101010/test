import { TestBed, inject } from '@angular/core/testing';

import { UsercreateService } from './usercreate.service';

describe('UsercreateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsercreateService]
    });
  });

  it('should be created', inject([UsercreateService], (service: UsercreateService) => {
    expect(service).toBeTruthy();
  }));
});
