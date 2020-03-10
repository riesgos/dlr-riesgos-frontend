import { TestBed, inject } from '@angular/core/testing';

import { FooterService } from './footer.service';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';

describe('FooterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FooterService],
      imports: [TranslateModule.forRoot(), ClarityModule]
    });
  });

  it('should be created', inject([FooterService], (service: FooterService) => {
    expect(service).toBeTruthy();
  }));
});
