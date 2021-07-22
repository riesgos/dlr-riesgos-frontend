import { Component, AfterContentChecked, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'ukis-scaler',
  templateUrl: './scaler.component.html',
  styleUrls: ['./scaler.component.scss']
})
export class ScalerComponent implements AfterContentChecked {

  @Input() public width: number;
  @Input() public height: number;
  public scale = 1.0;
  @ViewChild('wrappingDiv', { static: true }) wrappingDiv: ElementRef<HTMLDivElement>;

  constructor() { }

  ngAfterContentChecked(): void {
    if (this.wrappingDiv && this.wrappingDiv.nativeElement) {
      const relW = this.wrappingDiv.nativeElement.clientWidth / this.width;
      const relH = this.wrappingDiv.nativeElement.clientHeight / this.height;
      if (relW > 1.0 || relH > 1.0) {
        if (relW > relH) {
          this.scale = 1.0 / relW;
        } else {
          this.scale = 1.0 / relH;
        }
      } else {
        this.scale = 1.0;
      }
    }
  }
}
