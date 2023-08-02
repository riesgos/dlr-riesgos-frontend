import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { closeModal } from 'src/app/state/actions';
import { Partition, RiesgosState, ScenarioName } from 'src/app/state/state';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input() scenario!: ScenarioName;
  @Input() partition!:  Partition;
  @Input() title: string = "";
  @Input() subtitle: string = "";
  @Input() body: string = "";
  @Input() closable: boolean = false;

  constructor(private store: Store<{riesgos: RiesgosState}>) {}

  clickOnCloseButton() {
    this.store.dispatch(closeModal({ scenario: this.scenario, partition: this.partition }));
  }
}
