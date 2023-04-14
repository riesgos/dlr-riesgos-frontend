import { Component, Input } from '@angular/core';
import { ScenarioName, Partition } from 'src/app/state/state';
import { WizardComposite } from '../../wizard.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent {
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() data!: WizardComposite;
}
