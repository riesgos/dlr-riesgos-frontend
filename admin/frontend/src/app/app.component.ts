import { Component } from '@angular/core';
import { IAlert } from '@dlr-eoc/core-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  alert: IAlert = {
    type: 'info',
    text: 'This is a demonstrator',
    closeable: true
  }
  title = 'Riesgos';
}
