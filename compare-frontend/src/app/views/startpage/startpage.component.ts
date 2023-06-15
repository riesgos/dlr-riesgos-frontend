import { ParseSourceFile } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RiesgosState, ScenarioName } from 'src/app/state/state';
import * as AppActions from '../../state/actions';
import { RuleSetName } from 'src/app/state/rules';

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

  ruleSetPicked(id: ScenarioName, ruleSetName: RuleSetName) {
    this.store.dispatch(AppActions.ruleSetPicked({ rules: ruleSetName }));
    this.store.dispatch(AppActions.scenarioPicked({ scenario: id }));
    this.router.navigate(['/map']);
  }

}
