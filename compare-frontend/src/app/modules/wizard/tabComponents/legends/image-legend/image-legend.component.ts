import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-legend',
  templateUrl: './image-legend.component.html',
  styleUrls: ['./image-legend.component.css']
})
export class ImageLegendComponent {
  @Input() title?: string;
  @Input() url!: string;

}
