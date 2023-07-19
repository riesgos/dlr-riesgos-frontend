import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { isApiDatum } from 'src/app/services/backend.service';
import { TranslationService } from 'src/app/services/translation.service';
import { PartitionName, RiesgosState, ScenarioName } from 'src/app/state/state';


@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent {
  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  public title$: Observable<string>;

  constructor(private store: Store<{riesgos: RiesgosState}>, private translate: TranslationService, private cd: ChangeDetectorRef) {

    this.title$ = store.select(state => state.riesgos).pipe(

      map(riesgosState => {
        const scenarioData = riesgosState.scenarioData[this.scenario];
        if (!scenarioData) return undefined;
        const partitionData = scenarioData[this.partition];
        if (!partitionData) return undefined;
        const products = partitionData.apiData.data;
        const eqProd = products.find(p => p.id === "userChoice");
        if (!eqProd) return undefined;
        if (!isApiDatum(eqProd)) return undefined;
        if (!eqProd.value) return undefined;
        return eqProd.value;
      }),

      map(data => {
        if (data === undefined) return this.translate.translate("Wizard");
        const id = data["properties"]["publicID"].replace("quakeml:quakeledger/peru_", "");
        const depth = data["properties"]["origin.depth.value"];
        const mag = data["properties"]["magnitude.mag.value"];
        return `Mag. ${mag}, ${depth}km (${id})`;
      }),

    );
  }
}
