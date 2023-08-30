import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RiesgosState, ScenarioName } from 'src/app/state/state';
import * as AppActions from '../../state/actions';
import { RuleSetName } from 'src/app/state/rules';
import GeoJSON from 'ol/format/GeoJSON';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.css']
})
export class StartpageComponent implements OnInit {

  public showDisclaimer = true;

  public studyAreas$ = this.store.select((state) => {
    return state.riesgos.metaData
  });
  // feature = new GeoJSON().readFeature({
  //   type: "Feature", 
  //   geometry: {
  //     type: "Polygon",
  //     coordinates: []
  //   },
  //   properties: {
  //     'c1': '{"0": 0.2, "1": 2.3, "2": 0.1, "3": 0.2, "4": 1.2}',

  //   }
  // });

  constructor(
    private store: Store<{riesgos: RiesgosState}>,
    private local: StoreService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.showDisclaimer = this.local.readLocal('showDisclaimer') === 'false' ? false : true;
    this.store.dispatch(AppActions.scenarioLoadStart());
  }

  ruleSetPicked(id: ScenarioName, ruleSetName: RuleSetName) {
    this.store.dispatch(AppActions.ruleSetPicked({ rules: ruleSetName }));
    this.store.dispatch(AppActions.scenarioPicked({ scenario: id }));
    this.router.navigate(['/map']);
  }

  dontShowDisclaimerAgain() {
    this.local.writeLocal('showDisclaimer', 'false');
    this.showDisclaimer = false;
  }

}
