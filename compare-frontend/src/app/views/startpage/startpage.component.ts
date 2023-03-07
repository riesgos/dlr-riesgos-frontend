import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RiesgosState, ScenarioName } from 'src/app/state/state';
import * as AppActions from '../../state/actions';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.css']
})
export class StartpageComponent implements OnInit {

  public studyAreas$ = this.store.select((state) => {
    return state.riesgos.metaData
  });

  constructor(
    private store: Store<{riesgos: RiesgosState}>,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.store.dispatch(AppActions.scenarioLoadStart());
  }

  activateScenario(id: ScenarioName) {
    this.store.dispatch(AppActions.scenarioPicked({ scenario: id }));
    this.router.navigate(['/map']);
  }

}
