import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Partition, RiesgosState, ScenarioName } from 'src/app/state/state';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  public title$: Observable<string>;

  constructor(private store: Store<{riesgos: RiesgosState}>) {
    
    this.title$ = store.select(state => state.riesgos).pipe(

      map(riesgosState => {
        const scenarioData = riesgosState.scenarioData[this.scenario];
        if (!scenarioData) return undefined;
        const partitionData = scenarioData[this.partition];
        if (!partitionData) return undefined;
        const products = partitionData.products;
        const eqProd = products.find(p => p.id === "userChoice");
        if (!eqProd) return undefined;
        return eqProd.value;
      }),

      map(data => {
        if (data === undefined) return "Wizard";
        const id = data["properties"]["publicID"].replace("quakeml:quakeledger/peru_", "");
        const depth = data["properties"]["origin.depth.value"];
        const mag = data["properties"]["magnitude.mag.value"];
        return `Eq. ${id}, mag. ${mag}`;
      })
    )
  }
}
