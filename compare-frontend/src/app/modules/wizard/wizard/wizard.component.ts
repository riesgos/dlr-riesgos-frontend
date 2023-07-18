import { Observable, OperatorFunction, filter, map } from 'rxjs';
import { PartitionName, RiesgosScenarioState, RiesgosState, ScenarioName } from 'src/app/state/state';
import { Component, Input, OnInit } from '@angular/core';
import { WizardState, StepState } from './wizard.types';
import { Store } from '@ngrx/store';




@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @Input() focus!: boolean;
  public state$!: Observable<WizardState>;

  constructor(
    private store: Store<{riesgos: RiesgosState}>
  ) {}

  ngOnInit(): void {
    this.state$ = this.store.select(s => s.riesgos).pipe(

      map(s => {
        const scenarioData = s.scenarioData[this.scenario];
        if (!scenarioData) return undefined;
        const partitionData = scenarioData[this.partition];
        if (!partitionData) return undefined;
        return partitionData;
      }),

      filter(v => v !== undefined) as OperatorFunction<RiesgosScenarioState | undefined, RiesgosScenarioState>,

      map((partitionData: RiesgosScenarioState) => {
        const stepData: StepState[] = [];
        for (const control of partitionData.controls) {
          stepData.push({
            ...control,
            // info: getInfo(control.stepId),
            // legend: getLegend(control.stepId),            
            // error: getError(control.stepId),
          })
        }
        const wizardState: WizardState = { stepData };
        return wizardState;
      })

    );
  }

  public toggleFocus() {
    throw new Error('undefined');
  }


}
