import { Component } from '@angular/core';
import { DisclaimerService } from '../disclaimer/disclaimer.service';

@Component({
  selector: 'app-disclaimer-trigger',
  templateUrl: './disclaimer-trigger.component.html',
  styleUrls: ['./disclaimer-trigger.component.scss']
})
export class DisclaimerTriggerComponent {
  constructor(public disclaimerSvc: DisclaimerService) {

  }

  toggle(): void {
    this.disclaimerSvc.alertClosed = !this.disclaimerSvc.alertClosed;
  }

}
