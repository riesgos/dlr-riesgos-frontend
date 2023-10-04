import { Component, Input, OnInit } from '@angular/core';
import { Layer } from '@dlr-eoc/services-layers';

@Component({
  selector: 'app-legend-item',
  templateUrl: './legend-item.component.html',
  styleUrls: ['./legend-item.component.scss']
})
export class LegendItemComponent implements OnInit {

  @Input() layer: Layer;

  constructor() { }

  ngOnInit(): void {
  }

  checkIsComponentItem(obj: any, layer: Layer) {
    let isComp = false;
    if (obj && typeof obj === 'object') {
      if ('component' in obj) {
        if (!obj.inputs) {
          obj.inputs = { layer };
        } else if (obj.inputs && !obj.inputs.layer) {
          obj.inputs = Object.assign({ layer }, obj.inputs);
        }
        isComp = true;
      }
    }
    return isComp;
  }
}
