import { ParseSourceFile } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RiesgosState, Rules, ScenarioName } from 'src/app/state/state';
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

  ruleSetPicked(id: ScenarioName, ruleSetName: 'classicRules' | 'compareScenario' | 'compareAdvanced') {

    let rules: Rules = {
      partition: true,
      mirrorFocus: true,
      mirrorData: false,
      mirrorClick: true,
      mirrorMove: true,
      autoPilot: true
    };

    switch (ruleSetName) {
      case 'classicRules':
        rules.partition = false;
        rules.autoPilot = false;
        break;
      case 'compareScenario':
        break;
      case 'compareAdvanced':
        rules.mirrorFocus = false;
        rules.mirrorMove = false;
        rules.mirrorClick = false;
        rules.autoPilot = false;
        break;
    }
    
    this.store.dispatch(AppActions.ruleSetPicked({ rules }));
    this.store.dispatch(AppActions.scenarioPicked({ scenario: id }));
    this.router.navigate(['/map']);
  }

}
