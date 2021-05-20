import { Component, OnInit, HostBinding } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getScenarioMetadata } from 'src/app/riesgos/riesgos.selectors';
import { RiesgosScenarioMetadata } from 'src/app/riesgos/riesgos.state';
import { Observable } from 'rxjs';


@Component({
  selector: 'ukis-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.scss']
})
export class ScenariosComponent implements OnInit {
  @HostBinding('class') class = 'content-container';

  scenarios$: Observable<RiesgosScenarioMetadata[]>;
  showInfo = false;
  modalOpen = false;
  selectedScenario: RiesgosScenarioMetadata;

  hazardTypes = [{
    abbreviation: 'e',
    title: 'earthquakes'
  },
  {
    abbreviation: 'l',
    title: 'landslides'
  },
  {
    abbreviation: 'v',
    title: 'volcanoes'
  },
  {
    abbreviation: 'f',
    title: 'floods'
  },
  {
    abbreviation: 't',
    title: 'tsunamis'
  }];

  elementsAtRisk = [{
    abbreviation: 'i',
    title: 'infrastructure'
  }, {
    abbreviation: 'k',
    title: 'critical infrastructure'
  },
  {
    abbreviation: 'u',
    title: 'vulnerability'
  },
  {
    abbreviation: 'w',
    title: 'water supply'
  },
  {
    abbreviation: 'x',
    title: 'Exposure'
  },
  {
    abbreviation: 'z',
    title: 'electricity'
  }];


  constructor(
    public translator: TranslateService,
    public store: Store<State>
  ) {
    this.scenarios$ = this.store.select(getScenarioMetadata);
  }

  ngOnInit() {

  }

  showModal(s: RiesgosScenarioMetadata) {
    this.selectedScenario = s;
    this.showInfo = true;
    this.modalOpen = true;
  }

}
