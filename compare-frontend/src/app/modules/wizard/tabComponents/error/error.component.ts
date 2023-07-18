import { Component, Input, OnInit } from '@angular/core';
import { ScenarioName, PartitionName, RiesgosState } from 'src/app/state/state';
import { Store } from '@ngrx/store';
import { stepReset } from 'src/app/state/actions';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @Input() stepId!: string;
  @Input() data!: string;
  public message = "";

  constructor(private store: Store<{riesgos: RiesgosState}>) {}

  ngOnInit(): void {
      let message = this.data;
      message = message.replace(String.raw`\n`, "<br/>");
      message = message.replace(String.raw`\\`, "");
      this.message = message;
  }

  public retry() {
    this.store.dispatch(stepReset({scenario: this.scenario, partition: this.partition, stepId: this.stepId }));
  }
}
