import { ParseSourceFile } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RiesgosState, Rules, ScenarioName } from 'src/app/state/state';
import * as AppActions from '../../state/actions';
import { RuleService, RuleSetName } from 'src/app/services/rule.service';

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
    private ruleSvc: RuleService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.store.dispatch(AppActions.scenarioLoadStart());
  }

  ruleSetPicked(id: ScenarioName, ruleSetName: RuleSetName) {
    const rules = this.ruleSvc.getRules(ruleSetName);
    this.store.dispatch(AppActions.ruleSetPicked({ rules }));
    this.store.dispatch(AppActions.scenarioPicked({ scenario: id }));
    this.router.navigate(['/map']);
  }

}
