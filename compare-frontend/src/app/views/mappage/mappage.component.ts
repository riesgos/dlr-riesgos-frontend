import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs';
import { RiesgosState, ScenarioName, scenarioNameIsNotNone } from 'src/app/state/state';

@Component({
  selector: 'app-mappage',
  templateUrl: './mappage.component.html',
  styleUrls: ['./mappage.component.css']
})
export class MappageComponent {

  public scenario$ = this.store.select(state => state.riesgos.currentScenario).pipe(
    tap(scenario => {
      if (scenario === 'none') this.router.navigate(['/']);
    }),
    filter(scenario => scenarioNameIsNotNone(scenario)),
    map(s => s as ScenarioName)
  );

  public focus$ = this.store.select(state => state.riesgos).pipe(
    filter(state => scenarioNameIsNotNone(state.currentScenario)),
    map(state => {
      const currentScenario = state.currentScenario as ScenarioName;
      const currentScenarioData = state.scenarioData[currentScenario];
      return currentScenarioData;
    }),
    filter(data => {
      if (!data) return false;
      if (!data.left) return false;
      if (!data.right) return false;
      return true;
    }),
    map(currentScenarioData => {
      return {
        left: currentScenarioData!.left.active,
        right: currentScenarioData!.right.active
      }
    })
  );

  public rules$ = this.store.select(state => state.riesgos).pipe(
    map(state => state.rules)
  );

  constructor(
    private store: Store<{ riesgos: RiesgosState }>,
    private router: Router
  ) {
  }
}
