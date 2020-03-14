import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import Legend from 'ol-ext/control/Legend';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
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
