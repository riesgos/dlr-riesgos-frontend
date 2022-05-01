import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-changedetector',
  templateUrl: './changedetector.component.html',
  styleUrls: ['./changedetector.component.scss'],
})
export class ChangedetectorComponent {

  public display: boolean;

  constructor() {
    this.display = environment.production ? false : true;
  }

}
