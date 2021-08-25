import { TestBed } from '@angular/core/testing';

import { SimplifiedTranslationService } from './simplified-translation.service';

describe('SimplifiedTranslationService', () => {
  let service: SimplifiedTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimplifiedTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
