import { Component, Input } from '@angular/core';
import { Partition, ScenarioName } from 'src/app/state/state';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() data!: object;

  constructor() {
    console.log("Creating modal for ", this.partition);
  }
}
