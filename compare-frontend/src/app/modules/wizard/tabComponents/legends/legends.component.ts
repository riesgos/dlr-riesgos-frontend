import { Component, Input } from '@angular/core';
import { ScenarioName, Partition } from 'src/app/state/state';
import { WizardComposite } from '../../wizard.service';

@Component({
  selector: 'app-legends',
  templateUrl: './legends.component.html',
  styleUrls: ['./legends.component.css']
})
export class LegendsComponent {
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() data!: WizardComposite;
}
