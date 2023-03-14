import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'ol';
import { filter, map, MonoTypeOperatorFunction, tap } from 'rxjs';
import { RiesgosState, ScenarioName, scenarioNameIsNotNone, ScenarioNameOrNone } from 'src/app/state/state';

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

  constructor(
    private store: Store<{ riesgos: RiesgosState }>,
    private router: Router
  ) {
  }
}
