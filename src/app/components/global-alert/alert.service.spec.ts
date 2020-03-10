import { TestBed, inject } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';

describe('AlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService],
      imports: [TranslateModule.forRoot(), ClarityModule]
    });
  });

  it('should be created', inject([AlertService], (service: AlertService) => {
    expect(service).toBeTruthy();
  }));
});
