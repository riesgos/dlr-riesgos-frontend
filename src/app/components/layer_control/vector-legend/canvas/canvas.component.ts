import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import 'ol/ol.css';
import 'ol-ext/control/Legend.css';



@Component({
  selector: 'ukis-canvas',
  templateUrl: './canvas.component.html',
})
export class CanvasComponent implements OnInit {

  @Input() canvas: HTMLElement;
  @Input() resolution: number;
  @ViewChild('canvasDiv', {static: true}) canvasDiv: ElementRef;

  constructor() { }

  ngOnInit() {
    const legendDiv = this.canvasDiv.nativeElement;
    if (legendDiv) {
      legendDiv.append(this.canvas);
    }
  }

}
