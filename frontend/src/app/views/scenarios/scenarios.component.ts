import { Component, OnInit, HostBinding } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getScenarioMetadata } from 'src/app/riesgos/riesgos.selectors';
import { RiesgosScenarioMetadata } from 'src/app/riesgos/riesgos.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


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
    this.scenarios$ = this.store.select(getScenarioMetadata).pipe(
      // augmenting scenario-metadata with preview-images.
      // strictly, this should be added in an `Augmentor` ... 
      // ... but this is a very simple change.
      map(scenarios => {
        const augmentedScenarios: RiesgosScenarioMetadata[] = [];
        for (const scenario of scenarios) {
          if (scenario.id === 'Peru') {
            augmentedScenarios.push({
              ... scenario,
              title: 'Showcase Peru',
              preview: `assets/images/tsunami_${this.translator.currentLang.toLowerCase()}.jpg`
            });
          }
          if (scenario.id === 'Chile') {
            augmentedScenarios.push({
              ... scenario,
              title: 'Showcase Chile',
              preview: `assets/images/tsunami_${this.translator.currentLang.toLowerCase()}.jpg`
            });
          }
          if (scenario.id === 'Ecuador') {
            augmentedScenarios.push({
              ... scenario,
              title: 'Showcase Ecuador',
              preview: `assets/images/lahar_${this.translator.currentLang.toLowerCase()}.jpg`
            });
          }
        }
        return augmentedScenarios;
      })
    );
  }

  ngOnInit() {

  }

  showModal(s: RiesgosScenarioMetadata) {
    this.selectedScenario = s;
    this.showInfo = true;
    this.modalOpen = true;
  }

}
