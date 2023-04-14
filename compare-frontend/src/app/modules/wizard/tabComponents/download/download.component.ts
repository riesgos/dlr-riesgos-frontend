import { Component, Input } from '@angular/core';
import { ScenarioName, Partition } from 'src/app/state/state';
import { WizardComposite } from '../../wizard.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() data!: WizardComposite;
}
