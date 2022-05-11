import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisclaimerService {

  public alertClosed = false;
  constructor() {
    this.alertClosed = environment.production ? false : true;
  }
}
