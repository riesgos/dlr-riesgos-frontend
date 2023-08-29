import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { closeModal, dontShowAgainModal } from 'src/app/state/actions';
import { PartitionName, RiesgosState, ScenarioName } from 'src/app/state/state';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input() scenario!: ScenarioName;
  @Input() partition!:  PartitionName;
  @Input() id: string = "";
  @Input() title: string = "";
  @Input() subtitle: string = "";
  @Input() body: string = "";
  @Input() closable: boolean = false;
  @Input() dontShowAgainAble: boolean = false;

  constructor(private store: Store<{riesgos: RiesgosState}>) {}

  clickOnCloseButton() {
    this.store.dispatch(closeModal({ scenario: this.scenario, partition: this.partition }));
  }

  clickOnDontShowAgainButton() {
    this.store.dispatch(dontShowAgainModal({ scenario: this.scenario, partition: this.partition, modalId: this.id }));
  }
}
