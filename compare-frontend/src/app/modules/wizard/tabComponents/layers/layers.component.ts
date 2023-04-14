import { Component, Input } from '@angular/core';
import { Partition, ScenarioName } from 'src/app/state/state';
import { WizardComposite } from '../../wizard.service';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
})
export class LayersComponent {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() data!: WizardComposite;

}
