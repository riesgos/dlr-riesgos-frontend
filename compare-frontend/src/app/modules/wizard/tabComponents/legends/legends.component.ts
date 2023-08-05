import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ScenarioName, PartitionName } from 'src/app/state/state';
import { WizardComposite } from '../../wizard.service';

@Component({
  selector: 'app-legends',
  templateUrl: './legends.component.html',
  styleUrls: ['./legends.component.css']
})
export class LegendsComponent implements OnInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @Input() data!: WizardComposite;

  @ViewChild('legendAnchor', { read: ViewContainerRef, static: true }) anchor!: ViewContainerRef;

  ngOnInit(): void {
    if (this.data.legend) {
      const { component, args } = this.data.legend();
      const componentRef = this.anchor.createComponent(component);
      for (const [key, val] of Object.entries(args)) {
        componentRef.instance[key] = val;
      }
    }
  }
}
