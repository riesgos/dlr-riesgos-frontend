import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-fpser',
  templateUrl: './fpser.component.html',
  styleUrls: ['./fpser.component.scss']
})
export class FpserComponent {

  public fps: number;
  private pollingRate = 5000;
  private precission = 4;

  constructor(
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef
  ) {

  cdRef.detach();

  this.ngZone.runOutsideAngular(() => {
    this.updateFps(this.pollingRate);
  });
}

private updateFps(every: number) {
  setTimeout(() => {

    const t0 = window.performance.now();
    setTimeout(() => {
      const t1 = window.performance.now();
      const delta = t1 - t0;
      this.fps = this.round(1000 / delta, this.precission);
      this.cdRef.detectChanges();
      this.updateFps(every);
    }, 0);

  }, every); // sleeping

}


private round(nr: number, precission: number) {
  const fac = Math.pow(10, precission);
  const nrB = Math.floor(nr * fac);
  return nrB / fac;
}

}
