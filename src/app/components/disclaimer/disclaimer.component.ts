import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisclaimerService } from './disclaimer.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent {
  /* @Input() alertClosed = false;
  @Output() alertClosedChange = new EventEmitter<boolean>();
 */
  constructor(public disclaimerSvc: DisclaimerService) {
    // this.alertClosed = environment.production ? false : true;
  }

  close() {
    this.disclaimerSvc.alertClosed = true;
    /* this.alertClosed = true;
    this.alertClosedChange.emit(true); */
  }
}
