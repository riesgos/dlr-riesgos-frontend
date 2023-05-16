import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
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

  @ViewChild('descriptionAnchor', { read: ViewContainerRef, static: true }) anchor!: ViewContainerRef;

  ngOnInit(): void {
    if (this.data.info) {
      const { component, args } = this.data.info();
      const componentRef = this.anchor.createComponent(component);
      for (const [key, val] of Object.entries(args)) {
        componentRef.instance[key] = val;
      }
    }
  }
}
