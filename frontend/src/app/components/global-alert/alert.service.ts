import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface IAlert {
  type: string | 'info';
  text: string;
  closeable: boolean;
  closeAction?: () => void,
  actions?: { title: string, callback: () => void }[];
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSource = new Subject<IAlert>();
  alert$ = this.alertSource.asObservable();
  constructor() { }
  alert(alert: IAlert) {
    this.alertSource.next(alert);
  }
}
