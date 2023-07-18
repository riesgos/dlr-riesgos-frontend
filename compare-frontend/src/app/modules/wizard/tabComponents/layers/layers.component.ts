import { Component, Input } from '@angular/core';
import { Layer, PartitionName, ScenarioName } from 'src/app/state/state';


@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
})
export class LayersComponent {

  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @Input() data!: Layer[];

}
