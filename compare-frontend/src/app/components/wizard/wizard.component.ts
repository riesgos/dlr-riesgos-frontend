import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, OperatorFunction } from 'rxjs';
import { RiesgosProduct, RiesgosScenarioState, RiesgosState, RiesgosStep, ScenarioName } from 'src/app/state/state';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent {

  public stepData$ = this.store.select(state => {
    const scenario = state.riesgos.currentScenario;
    if (scenario === 'none') return undefined;
    const scenarioState = state.riesgos.scenarioData[scenario];
    return scenarioState;
  }).pipe(
    filter(v => v !== undefined) as OperatorFunction<RiesgosScenarioState | undefined, RiesgosScenarioState>,
    map(scenarioState => {
      const out: {scenario: ScenarioName, step: RiesgosStep, inputs: RiesgosProduct[], outputs: RiesgosProduct[]}[] = [];
      for (const step of scenarioState.steps) {
        const scenario = scenarioState.scenario;
        const inputIds = step.step.inputs.map(i => i.id);
        const inputs = scenarioState.products.filter(p => inputIds.includes(p.id));
        const outputIds = step.step.outputs.map(i => i.id);
        const outputs = scenarioState.products.filter(p => outputIds.includes(p.id));
        out.push({ scenario, step, inputs, outputs });
      }
      return out;
    })
  );

  constructor(private store: Store<{riesgos: RiesgosState}>) {}
}
