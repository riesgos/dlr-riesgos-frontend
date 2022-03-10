import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IAlert } from './alert.service';

@Component({
  selector: 'app-global-alert',
  templateUrl: './global-alert.component.html',
  styleUrls: ['./global-alert.component.scss']
})
export class GlobalAlertComponent {
  @Input() alert!: null | IAlert;
  @Output() alertChange = new EventEmitter();
  constructor() { }

  close() {
    if (this.alert.closeAction) {
      this.alert.closeAction();
    }
    this.alert = null;
    this.alertChange.emit(this.alert);

  }

}
