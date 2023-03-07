import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, OperatorFunction } from 'rxjs';
import { RiesgosScenarioState, RiesgosState } from 'src/app/state/state';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent {

  public scenarioState$ = this.store.select(state => {
    const scenario = state.riesgos.currentScenario;
    if (scenario === 'none') return undefined;
    const scenarioState = state.riesgos.scenarioData[scenario];
    return scenarioState;
  }).pipe(
    filter(v => v !== undefined)  as OperatorFunction<RiesgosScenarioState | undefined, RiesgosScenarioState>
  );

  constructor(private store: Store<{riesgos: RiesgosState}>) {}
}
