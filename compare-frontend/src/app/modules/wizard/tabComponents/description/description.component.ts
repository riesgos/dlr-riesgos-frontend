import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ScenarioName, PartitionName } from 'src/app/state/state';
import { Info } from '../../wizard/wizard.types';


@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent {
  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @Input() data!: Info;

  @ViewChild('descriptionAnchor', { read: ViewContainerRef, static: true }) anchor!: ViewContainerRef;

  ngOnInit(): void {
    const { component, args } = this.data;
    const componentRef = this.anchor.createComponent(component);
    for (const [key, val] of Object.entries(args)) {
      componentRef.instance[key] = val;
    }
  }
}
