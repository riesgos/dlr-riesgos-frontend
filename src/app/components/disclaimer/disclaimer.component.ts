import { Component } from '@angular/core';
import { DisclaimerService } from './disclaimer.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent {

  constructor(public disclaimerSvc: DisclaimerService) {

  }

  close() {
    this.disclaimerSvc.alertClosed = true;
    /* this.alertClosed = true;
    this.alertClosedChange.emit(true); */
  }
}
