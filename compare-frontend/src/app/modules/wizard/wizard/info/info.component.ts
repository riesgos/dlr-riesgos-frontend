import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map, tap } from 'rxjs';
import { TranslationService } from 'src/app/services/translation.service';
import { getRules } from 'src/app/state/rules';
import { PartitionName, RiesgosState, ScenarioName, StepStateTypes } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {


  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  public title$: Observable<string>;
  public allowsReset$: Observable<boolean>;

  constructor(
    private store: Store<{riesgos: RiesgosState}>, 
    private translate: TranslationService
  ) {

    this.title$ = this.store.select(state => state.riesgos).pipe(

      map(riesgosState => {
        const scenarioData = riesgosState.scenarioData[this.scenario];
        if (!scenarioData) return undefined;
        const partitionData = scenarioData[this.partition];
        if (!partitionData) return undefined;
        const products = partitionData.products;
        const eqProd = products.find(p => p.id === "userChoice");
        if (!eqProd) return undefined;
        return eqProd.value;
      }),

      map(data => {
        if (data === undefined) return this.translate.translate("Wizard");
        const id = data["properties"]["publicID"].replace("quakeml:quakeledger/peru_", "");
        const depth = data["properties"]["origin.depth.value"];
        const mag = data["properties"]["magnitude.mag.value"];
        return `Mw ${mag}, ${depth} km (${id})`;
      })
    );

    this.allowsReset$ = this.store.select(state => state.riesgos).pipe(
      map(riesgosState => {
        const partitionData = riesgosState.scenarioData[this.scenario]![this.partition]!;
        const allowsReset = getRules(riesgosState.rules).allowReset(this.partition);
        const queue = partitionData.autoPilot.queue;
        const runningProcesses = partitionData?.steps.filter(s => s.state.type === StepStateTypes.running);
        const completedProcesses = partitionData?.steps.filter(s => s.state.type === StepStateTypes.completed);
        return allowsReset && queue?.length <= 0 && runningProcesses.length === 0 && completedProcesses.length > 0;
      }),
    );


  }

  reset() {
    this.store.dispatch(AppActions.stepResetAll({ scenario: this.scenario, partition: this.partition }));
  }

}
